// client/app/admin/tutor-approvals/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface PendingProfile {
    id: string;
    isApproved: boolean;
    user: {
        fullName: string;
        email: string;
    };
}

export default function TutorApprovalsPage() {
    const [pending, setPending] = useState<PendingProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    const fetchPendingProfiles = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:8000/api/admin/tutors/pending', {
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Failed to fetch pending profiles.');
            const data = await res.json();
            setPending(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingProfiles();
    }, []);

    const handleApproval = async (profileId: string, isApproved: boolean) => {
        try {
            const res = await fetch(`http://localhost:8000/api/admin/tutors/${profileId}/approve`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ isApproved }),
            });
            if (!res.ok) throw new Error('Failed to update status.');
            
            // Refresh the list after updating
            fetchPendingProfiles();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'An unknown error occurred.');
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Tutor Approvals</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Pending Applications</CardTitle>
                    <CardDescription>Review and approve or deny new tutor applications.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tutor Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pending.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">No pending applications.</TableCell>
                                    </TableRow>
                                ) : (
                                    pending.map((profile) => (
                                        <TableRow key={profile.id}>
                                            <TableCell className="font-medium">{profile.user.fullName}</TableCell>
                                            <TableCell>{profile.user.email}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">Pending</Badge>
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50" onClick={() => handleApproval(profile.id, true)}>
                                                    <CheckCircle className="mr-2 h-4 w-4" /> Approve
                                                </Button>
                                                <Button size="sm" variant="destructive" onClick={() => handleApproval(profile.id, false)}>
                                                    <XCircle className="mr-2 h-4 w-4" /> Deny
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
