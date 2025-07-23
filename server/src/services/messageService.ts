// server/src/services/messageService.ts
import prisma from '../lib/prisma';
import { Server } from 'socket.io';
import { userSocketMap } from '../socket';

// --- Service to get all conversations for a user ---
export const getConversationsForUser = async (userId: string) => {
    const conversations = await prisma.conversation.findMany({
        where: {
            participants: {
                some: { id: userId }
            }
        },
        include: {
            participants: {
                select: { id: true, fullName: true, profilePicture: true }
            },
            messages: {
                orderBy: { createdAt: 'desc' },
                take: 1
            },
            _count: {
                select: {
                    messages: {
                        where: {
                            isRead: false,
                            NOT: {
                                senderId: userId // Count messages NOT sent by the current user
                            }
                        }
                    }
                }
            }
        },
        orderBy: {
            updatedAt: 'desc'
        }
    });

    // Map the result to match the frontend's expected 'unreadCount' property
    return conversations.map(convo => ({
        ...convo,
        unreadCount: convo._count.messages
    }));
};

// --- Service to mark messages in a conversation as read ---
export const markConversationAsRead = async (userId: string, conversationId: string) => {
    // First, verify the user is part of the conversation to prevent unauthorized updates
    const conversation = await prisma.conversation.findFirst({
        where: {
            id: conversationId,
            participants: { some: { id: userId } }
        }
    });

    if (!conversation) {
        throw new Error("User is not a participant of this conversation.");
    }

    await prisma.message.updateMany({
        where: {
            conversationId: conversationId,
            isRead: false,
            NOT: {
                senderId: userId // Don't mark your own messages as read
            }
        },
        data: {
            isRead: true
        }
    });
};


export const sendMessage = async (senderId: string, receiverId: string, content: string, io: Server) => {
    if (senderId === receiverId) {
        throw new Error('Cannot send a message to yourself.');
    }
    
    let conversation = await prisma.conversation.findFirst({
        where: {
            AND: [
                { participants: { some: { id: senderId } } },
                { participants: { some: { id: receiverId } } }
            ]
        }
    });

    if (!conversation) {
        conversation = await prisma.conversation.create({
            data: {
                participants: {
                    connect: [{ id: senderId }, { id: receiverId }]
                }
            }
        });
    }

    const newMessage = await prisma.message.create({
        data: {
            content,
            senderId,
            conversationId: conversation.id
        },
        include: {
            sender: {
                select: { id: true, fullName: true, profilePicture: true }
            }
        }
    });
    
    const updatedConversation = await prisma.conversation.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() },
        include: {
            participants: {
                select: { id: true, fullName: true, profilePicture: true }
            },
            messages: {
                orderBy: { createdAt: 'desc' },
                take: 1
            }
        }
    });

    const receiverSocketId = userSocketMap.get(receiverId);

    if (receiverSocketId) {
        io.to(receiverSocketId).emit('newMessage', newMessage);
    }

    // --- Emit conversation updates to both users ---
    const senderSocketId = userSocketMap.get(senderId);

    // For the sender, the unread count is always 0 for this conversation
    const senderConvoView = { 
        ...updatedConversation, 
        unreadCount: 0 
    };

    // For the receiver, we need to calculate their new unread count
    const receiverUnreadCount = await prisma.message.count({
        where: {
            conversationId: conversation.id,
            isRead: false,
            NOT: { senderId: receiverId }
        }
    });
    const receiverConvoView = { 
        ...updatedConversation, 
        unreadCount: receiverUnreadCount 
    };

    if (senderSocketId) {
        io.to(senderSocketId).emit('conversationUpdated', senderConvoView);
    }
    if (receiverSocketId) {
        io.to(receiverSocketId).emit('conversationUpdated', receiverConvoView);
    }

    return newMessage;
};

export const getMessagesInConversation = async (userId: string, conversationId: string) => {
    const conversation = await prisma.conversation.findFirst({
        where: {
            id: conversationId,
            participants: { some: { id: userId } }
        }
    });

    if (!conversation) {
        throw new Error('Conversation not found or you do not have permission to view it.');
    }

    return prisma.message.findMany({
        where: { conversationId },
        include: {
            sender: {
                select: { id: true, fullName: true, profilePicture: true }
            },
            conversation: {
                include: {
                    participants: {
                        select: { id: true, fullName: true, profilePicture: true }
                    }
                }
            }
        },
        orderBy: {
            createdAt: 'asc'
        }
    });
};
