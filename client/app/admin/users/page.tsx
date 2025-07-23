// client/app/admin/users/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, UserCog, Ban, CheckCircle } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface User {
    id: string;
    fullName: string;
    email: string;
    role: 'STUDENT' | 'TUTOR' | 'ADMIN';
    isActive: boolean;
    createdAt: string;
}

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:8000/api/admin/users', {
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Failed to fetch users.');
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUpdateRole = async (userId: string, role: User['role']) => {
        try {
            await fetch(`http://localhost:8000/api/admin/users/${userId}/role`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ role }),
            });
            fetchUsers(); // Refresh list
        } catch (err) {
            alert('Failed to update role.');
        }
    };

    const handleUpdateStatus = async (userId: string, isActive: boolean) => {
        try {
            await fetch(`http://localhost:8000/api/admin/users/${userId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ isActive }),
            });
            fetchUsers(); // Refresh list
        } catch (err) {
            alert('Failed to update status.');
        }
    };

    const getRoleBadgeVariant = (role: User['role']) => {
        switch (role) {
            case 'ADMIN': return 'destructive';
            case 'TUTOR': return 'default';
            default: return 'secondary';
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">User Management</h1>
            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>View and manage all user accounts on the platform.</CardDescription>
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
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.fullName}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={user.isActive ? 'default' : 'outline'} className={user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <UserCog className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Manage User</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleUpdateRole(user.id, 'STUDENT')}>Make Student</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleUpdateRole(user.id, 'TUTOR')}>Make Tutor</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleUpdateRole(user.id, 'ADMIN')}>Make Admin</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    {user.isActive ? (
                                                        <DropdownMenuItem className="text-red-600" onClick={() => handleUpdateStatus(user.id, false)}>
                                                            <Ban className="mr-2 h-4 w-4" /> Deactivate
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem className="text-green-600" onClick={() => handleUpdateStatus(user.id, true)}>
                                                            <CheckCircle className="mr-2 h-4 w-4" /> Activate
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
