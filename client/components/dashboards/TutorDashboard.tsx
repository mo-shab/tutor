// client/components/dashboards/TutorDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, CalendarCheck, DollarSign, Check, X, Loader2, User, Clock, CheckCircle } from 'lucide-react';

interface Session {
    id: string;
    subject: string;
    scheduledAt: string;
    status: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'CANCELED';
    student: {
        fullName: string;
    };
}

export default function TutorDashboard() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchSessions = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:8000/api/sessions/tutor', {
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Failed to fetch sessions.');
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

    const handleUpdateStatus = async (sessionId: string, status: 'ACCEPTED' | 'CANCELED') => {
        if (status === 'CANCELED' && !confirm('Are you sure you want to cancel this session?')) {
            return;
        }
        try {
            await fetch(`http://localhost:8000/api/sessions/${sessionId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ status }),
            });
            fetchSessions();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'An unknown error occurred.');
        }
    };

    const handleMarkAsCompleted = async (sessionId: string) => {
        try {
            await fetch(`http://localhost:8000/api/sessions/${sessionId}/complete`, {
                method: 'PATCH',
                credentials: 'include',
            });
            fetchSessions();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'An unknown error occurred.');
        }
    };

    const pendingSessions = sessions.filter(s => s.status === 'PENDING');
    const acceptedSessions = sessions.filter(s => s.status === 'ACCEPTED');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <CalendarCheck className="mr-2 h-5 w-5 text-indigo-500"/> 
                            Session Requests
                            {pendingSessions.length > 0 && (
                                <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full">{pendingSessions.length}</span>
                            )}
                        </CardTitle>
                        <CardDescription>Review and respond to new session requests from students.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center p-6"><Loader2 className="h-8 w-8 animate-spin text-gray-400"/></div>
                        ) : error ? (
                            <p className="text-sm text-red-500">{error}</p>
                        ) : pendingSessions.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">You have no new session requests.</p>
                        ) : (
                            <div className="space-y-4">
                                {pendingSessions.map(session => (
                                    <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                                        <div>
                                            <p className="font-semibold">{session.subject} with {session.student.fullName}</p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(session.scheduledAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="icon" variant="outline" className="text-green-600 border-green-600 hover:bg-green-100 hover:text-green-700" onClick={() => handleUpdateStatus(session.id, 'ACCEPTED')}>
                                                <Check className="h-4 w-4"/>
                                            </Button>
                                             <Button size="icon" variant="outline" className="text-red-600 border-red-600 hover:bg-red-100 hover:text-red-700" onClick={() => handleUpdateStatus(session.id, 'CANCELED')}>
                                                <X className="h-4 w-4"/>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><CalendarCheck className="mr-2 h-5 w-5 text-indigo-500"/> Upcoming & Past Sessions</CardTitle>
                        <CardDescription>Here are your confirmed sessions. Mark them as complete after they occur.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center p-6"><Loader2 className="h-8 w-8 animate-spin text-gray-400"/></div>
                        ) : acceptedSessions.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">You have no upcoming or past sessions to manage.</p>
                        ) : (
                             <ul className="space-y-3">
                                 {acceptedSessions.map(session => {
                                    const isPast = new Date(session.scheduledAt) < new Date();
                                    return (
                                        <li key={session.id} className="p-4 border rounded-lg flex items-center justify-between">
                                            <div className="flex items-start space-x-4">
                                                <div className="bg-indigo-100 p-3 rounded-lg">
                                                    <CalendarCheck className="h-6 w-6 text-indigo-600"/>
                                                </div>
                                                <div className="flex-grow">
                                                    <p className="font-semibold text-gray-800">{session.subject}</p>
                                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                                        <User className="h-4 w-4 mr-2"/>
                                                        <span>{session.student.fullName}</span>
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                                        <Clock className="h-4 w-4 mr-2"/>
                                                        <span>{new Date(session.scheduledAt).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end space-y-2">
                                                {isPast ? (
                                                    <Button size="sm" onClick={() => handleMarkAsCompleted(session.id)}>
                                                        <CheckCircle className="mr-2 h-4 w-4"/> Mark as Completed
                                                    </Button>
                                                ) : (
                                                    <Button size="sm" variant="destructive" onClick={() => handleUpdateStatus(session.id, 'CANCELED')}>
                                                        <X className="mr-1 h-4 w-4" /> Cancel
                                                    </Button>
                                                )}
                                            </div>
                                        </li>
                                    );
                                 })}
                             </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><Edit className="mr-2 h-5 w-5 text-indigo-500"/> Manage Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="mb-4">Keep your information up to date to attract more students.</CardDescription>
                        <Link href="/tutor/profile" passHref>
                            <Button className="w-full">
                                Edit Your Tutor Profile
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><DollarSign className="mr-2 h-5 w-5 text-indigo-500"/> My Earnings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>Earnings data is not yet available.</CardDescription>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
