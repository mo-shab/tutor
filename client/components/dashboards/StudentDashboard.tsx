// client/components/dashboards/StudentDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, History, Loader2, Clock, User, XCircle } from 'lucide-react';

// Define the shape of a session object from the student's perspective
interface Session {
    id: string;
    subject: string;
    scheduledAt: string;
    status: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'CANCELED';
    tutor: {
        fullName: string;
    };
}

// Helper to get a color based on status
const getStatusBadgeColor = (status: Session['status']) => {
    switch (status) {
        case 'ACCEPTED':
            return 'bg-green-100 text-green-800';
        case 'PENDING':
            return 'bg-yellow-100 text-yellow-800';
        case 'CANCELED':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

export default function StudentDashboard() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchSessions = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:8000/api/sessions/student', {
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Failed to fetch your sessions.');
            const data = await res.json();
            setSessions(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const pendingSessions = sessions.filter(s => s.status === 'PENDING');
    const upcomingSessions = sessions.filter(s => s.status === 'ACCEPTED');
    const canceledSessions = sessions.filter(s => s.status === 'CANCELED');


    return (
        <div className="space-y-6">
            {/* Find a Tutor Call to Action */}
            <Card className="bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800">
                <CardHeader>
                    <CardTitle>Ready to Learn?</CardTitle>
                    <CardDescription>Browse our qualified tutors to find the perfect match for your learning goals.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/find-a-tutor" passHref>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
                            <Search className="mr-2 h-4 w-4" />
                            Find a Tutor
                        </Button>
                    </Link>
                </CardContent>
            </Card>

            {/* My Sessions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Calendar className="mr-2 h-5 w-5 text-indigo-500"/> My Sessions
                    </CardTitle>
                    <CardDescription>Here's a summary of your pending and upcoming sessions.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center p-6"><Loader2 className="h-8 w-8 animate-spin text-gray-400"/></div>
                    ) : error ? (
                        <p className="text-sm text-red-500">{error}</p>
                    ) : (
                        <div className="space-y-6">
                            {/* Pending Sessions */}
                            <div>
                                <h3 className="font-semibold mb-3">Pending Confirmation</h3>
                                {pendingSessions.length === 0 ? (
                                    <p className="text-sm text-gray-500">You have no pending session requests.</p>
                                ) : (
                                    <ul className="space-y-3">
                                        {pendingSessions.map(session => (
                                            <li key={session.id} className="p-4 border rounded-lg flex items-start space-x-4">
                                                <div className="bg-yellow-100 p-3 rounded-lg">
                                                    <Clock className="h-6 w-6 text-yellow-600"/>
                                                </div>
                                                <div className="flex-grow">
                                                    <p className="font-semibold text-gray-800">{session.subject}</p>
                                                    <p className="text-sm text-gray-500 mt-1">with {session.tutor.fullName}</p>
                                                </div>
                                                <Badge className={getStatusBadgeColor(session.status)}>{session.status}</Badge>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            {/* Upcoming Sessions */}
                            <div>
                                <h3 className="font-semibold mb-3">Upcoming Sessions</h3>
                                {upcomingSessions.length === 0 ? (
                                    <p className="text-sm text-gray-500">You have no upcoming sessions scheduled.</p>
                                ) : (
                                    <ul className="space-y-3">
                                        {upcomingSessions.map(session => (
                                            <li key={session.id} className="p-4 border rounded-lg flex items-start space-x-4">
                                                <div className="bg-green-100 p-3 rounded-lg">
                                                    <Calendar className="h-6 w-6 text-green-600"/>
                                                </div>
                                                <div className="flex-grow">
                                                    <p className="font-semibold text-gray-800">{session.subject}</p>
                                                    <p className="text-sm text-gray-500 mt-1">with {session.tutor.fullName}</p>
                                                    <p className="text-sm text-gray-500 mt-1">{new Date(session.scheduledAt).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>
                                                </div>
                                                <Badge className={getStatusBadgeColor(session.status)}>{session.status}</Badge>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                             {/* Canceled/Rejected Sessions */}
                            <div>
                                <h3 className="font-semibold mb-3">Canceled / Rejected Sessions</h3>
                                {canceledSessions.length === 0 ? (
                                    <p className="text-sm text-gray-500">You have no canceled or rejected sessions.</p>
                                ) : (
                                    <ul className="space-y-3">
                                        {canceledSessions.map(session => (
                                            <li key={session.id} className="p-4 border rounded-lg flex items-start space-x-4 bg-red-50/50">
                                                <div className="bg-red-100 p-3 rounded-lg">
                                                    <XCircle className="h-6 w-6 text-red-600"/>
                                                </div>
                                                <div className="flex-grow">
                                                    <p className="font-semibold text-gray-800">{session.subject}</p>
                                                    <p className="text-sm text-gray-500 mt-1">with {session.tutor.fullName}</p>
                                                </div>
                                                <Badge className={getStatusBadgeColor(session.status)}>{session.status}</Badge>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
