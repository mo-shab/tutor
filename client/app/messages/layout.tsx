// client/app/messages/layout.tsx
'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';

// Define the shape of a conversation, now with unreadCount
interface Conversation {
    id: string;
    participants: {
        id: string;
        fullName: string;
        profilePicture: string | null;
    }[];
    messages: {
        content: string;
        createdAt: string;
    }[];
    updatedAt: string;
    unreadCount: number; // New property for unread messages
}

export default function MessagesLayout({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const { socket } = useSocket();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) return;

        const fetchConversations = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/messages', {
                    credentials: 'include',
                });
                if (!res.ok) throw new Error('Failed to fetch conversations.');
                const data = await res.json();
                setConversations(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchConversations();
    }, [user]);

    useEffect(() => {
        if (!socket) return;

        const handleConversationUpdate = (updatedConvo: Conversation) => {
            setConversations(prevConvos => {
                const filteredConvos = prevConvos.filter(c => c.id !== updatedConvo.id);
                return [updatedConvo, ...filteredConvos];
            });
        };

        socket.on('conversationUpdated', handleConversationUpdate);

        return () => {
            socket.off('conversationUpdated', handleConversationUpdate);
        };
    }, [socket]);

    return (
        <div className="h-full flex bg-gray-100">
            {/* Left Sidebar: Conversation List */}
            <aside className="w-1/3 h-full border-r bg-white flex flex-col">
                <CardHeader>
                    <CardTitle className="text-2xl">Conversations</CardTitle>
                </CardHeader>
                <div className="flex-grow overflow-y-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : error ? (
                        <p className="text-red-500 p-4">{error}</p>
                    ) : conversations.length === 0 ? (
                        <p className="text-gray-500 p-4 text-center">You have no conversations yet.</p>
                    ) : (
                        <ul>
                            {conversations.map((convo) => {
                                const otherParticipant = convo.participants.find(p => p.id !== user?.id);
                                if (!otherParticipant) return null;

                                return (
                                    <li key={convo.id}>
                                        <Link href={`/messages/${convo.id}`} passHref>
                                            {/* --- THIS IS THE UPDATED BLOCK --- */}
                                            <div className={`flex items-center p-4 border-b hover:bg-gray-50 cursor-pointer ${convo.unreadCount > 0 ? 'bg-indigo-50' : ''}`}>
                                                <Avatar className="h-12 w-12 mr-4">
                                                    <AvatarImage src={otherParticipant.profilePicture || undefined} alt={otherParticipant.fullName} />
                                                    <AvatarFallback>{otherParticipant.fullName.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-grow overflow-hidden">
                                                    <p className={`truncate ${convo.unreadCount > 0 ? 'font-semibold' : 'font-medium'}`}>{otherParticipant.fullName}</p>
                                                    <p className={`text-sm truncate ${convo.unreadCount > 0 ? 'text-gray-800' : 'text-gray-500'}`}>
                                                        {convo.messages[0]?.content || 'No messages yet'}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end space-y-1 ml-2">
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(convo.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {convo.unreadCount > 0 && (
                                                        <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                                                            {convo.unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </aside>

            {/* Right Side: This will render the specific page */}
            <main className="w-2/3 h-full flex flex-col">
                {children}
            </main>
        </div>
    );
}
