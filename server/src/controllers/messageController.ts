import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { getConversationsForUser, getMessagesInConversation, sendMessage, markConversationAsRead } from '../services/messageService';

// ... (getMyConversationsController, getMessagesController, sendMessageController remain the same) ...
export const getMyConversationsController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(400).json({ message: 'User ID not found' });

        const conversations = await getConversationsForUser(userId);
        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({ message: 'An unexpected error occurred' });
    }
};

export const getMessagesController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { conversationId } = req.params;
        if (!userId) return res.status(400).json({ message: 'User ID not found' });

        const messages = await getMessagesInConversation(userId, conversationId);
        res.status(200).json(messages);
    } catch (error) {
        if (error instanceof Error) return res.status(403).json({ message: error.message });
        res.status(500).json({ message: 'An unexpected error occurred' });
    }
};

export const sendMessageController = async (req: AuthRequest, res: Response) => {
    try {
        const senderId = req.user?.userId;
        const { receiverId, content } = req.body;
        if (!senderId) return res.status(400).json({ message: 'User ID not found' });
        if (!receiverId || !content) return res.status(400).json({ message: 'Receiver ID and content are required' });

        const message = await sendMessage(senderId, receiverId, content, req.io);
        res.status(201).json(message);
    } catch (error) {
        if (error instanceof Error) return res.status(400).json({ message: error.message });
        res.status(500).json({ message: 'An unexpected error occurred' });
    }
};

// New controller to handle marking a conversation as read
export const markAsReadController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { conversationId } = req.params;
        if (!userId) return res.status(400).json({ message: 'User ID not found' });

        await markConversationAsRead(userId, conversationId);
        res.status(200).json({ message: 'Conversation marked as read.' });
    } catch (error) {
         res.status(500).json({ message: 'An unexpected error occurred' });
    }
};
