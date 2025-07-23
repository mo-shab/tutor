// client/app/messages/[conversationId]/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send } from 'lucide-react';

interface Participant {
    id: string;
    fullName: string;
    profilePicture: string | null;
}

interface Message {
    id: string;
    content: string;
    createdAt: string;
    conversationId: string;
    sender: Participant;
    conversation: {
        participants: Participant[];
    };
}

export default function ChatPage() {
    const { user } = useAuth();
    const { socket } = useSocket();
    const params = useParams();
    const conversationId = params.conversationId as string;
    
    const [messages, setMessages] = useState<Message[]>([]);
    const [otherParticipant, setOtherParticipant] = useState<Participant | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchMessagesAndMarkRead = async () => {
            if (!conversationId || !user) return;
            setIsLoading(true);
            try {
                // Mark conversation as read
                await fetch(`http://localhost:8000/api/messages/${conversationId}/read`, {
                    method: 'PATCH',
                    credentials: 'include',
                });

                // Fetch messages
                const res = await fetch(`http://localhost:8000/api/messages/${conversationId}`, {
                    credentials: 'include',
                });
                if (!res.ok) throw new Error('Failed to fetch messages.');
                const data = await res.json();
                setMessages(data);

                if (data.length > 0) {
                    const firstMessage = data[0];
                    const participant = firstMessage.conversation.participants.find(
                        (p: Participant) => p.id !== user.id
                    );
                    setOtherParticipant(participant || null);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMessagesAndMarkRead();
    }, [conversationId, user]);

    useEffect(() => {
        if (!socket) return;
        const handleNewMessage = (message: Message) => {
            if (message.conversationId === conversationId) {
                setMessages((prevMessages) => [...prevMessages, message]);
                // Also mark as read in real-time if the window is open
                 fetch(`http://localhost:8000/api/messages/${conversationId}/read`, {
                    method: 'PATCH',
                    credentials: 'include',
                });
            }
        };
        socket.on('newMessage', handleNewMessage);
        return () => {
            socket.off('newMessage', handleNewMessage);
        };
    }, [socket, conversationId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || !socket || !otherParticipant) return;

        const optimisticMessage: Message = {
            id: Date.now().toString(),
            content: newMessage,
            createdAt: new Date().toISOString(),
            conversationId: conversationId,
            sender: { id: user.id, fullName: user.fullName, profilePicture: null },
            conversation: { participants: [] }
        };
        setMessages((prev) => [...prev, optimisticMessage]);
        setNewMessage('');

        try {
            await fetch('http://localhost:8000/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ 
                    receiverId: otherParticipant.id,
                    content: newMessage 
                }),
            });
        } catch (err) {
            console.error("Failed to send message via API", err);
            setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
        }
    };

    if (isLoading) {
        return <div className="flex-grow flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="h-full flex flex-col bg-white">
            <header className="p-4 border-b flex items-center">
                {otherParticipant && (
                    <>
                        <Avatar className="mr-4">
                            <AvatarImage src={otherParticipant.profilePicture || undefined} />
                            <AvatarFallback>{otherParticipant.fullName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h2 className="text-xl font-semibold">{otherParticipant.fullName}</h2>
                    </>
                )}
            </header>
            <div className="flex-grow p-6 overflow-y-auto">
                <div className="space-y-6">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-end gap-3 ${msg.sender.id === user?.id ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender.id !== user?.id && (
                                <Avatar>
                                    <AvatarImage src={msg.sender.profilePicture || undefined} />
                                    <AvatarFallback>{msg.sender.fullName.charAt(0)}</AvatarFallback>
                                </Avatar>
                            )}
                            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender.id === user?.id ? 'bg-indigo-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                                <p>{msg.content}</p>
                                <p className={`text-xs mt-1 ${msg.sender.id === user?.id ? 'text-indigo-200' : 'text-gray-500'}`}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <footer className="p-4 border-t bg-gray-50">
                <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                    <Input 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-grow"
                    />
                    <Button type="submit">
                        <Send className="h-5 w-5" />
                    </Button>
                </form>
            </footer>
        </div>
    );
}
