// client/app/admin/layout.tsx
'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Users, UserCheck } from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-slate-500" />
            </div>
        );
    }

    // Protect the route: if not loading, and user is not an admin, redirect
    if (!user || user.role !== 'ADMIN') {
        router.push('/dashboard'); // Or a dedicated 'unauthorized' page
        return null; // Return null while redirecting
    }

    return (
        <div className="flex min-h-screen">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-gray-800 text-white flex flex-col">
                <div className="p-6 text-2xl font-bold border-b border-gray-700">
                    Admin Panel
                </div>
                <nav className="flex-grow p-4">
                    <ul>
                        <li>
                            <Link href="/admin/tutor-approvals" className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors">
                                <UserCheck className="mr-3 h-5 w-5" />
                                Tutor Approvals
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/users" className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors">
                                <Users className="mr-3 h-5 w-5" />
                                User Management
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-8 bg-gray-100">
                {children}
            </main>
        </div>
    );
}
