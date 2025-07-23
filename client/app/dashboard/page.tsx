'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LogoutButton from '@/components/LogoutButton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If the auth state is not loading and there is no user, redirect to login
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // While loading or if there's no user (and redirect is imminent), show a loader
  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-slate-500" />
      </div>
    );
  }

  // If user is authenticated, show the dashboard
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Welcome to Your Dashboard</CardTitle>
          <CardDescription className="text-center text-lg">
            Hello, <span className="font-semibold text-indigo-600">{user.fullName}!</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg bg-slate-50">
            <h3 className="font-semibold">Your Profile Details:</h3>
            <ul className="mt-2 list-disc list-inside text-gray-700">
              <li><strong>Email:</strong> {user.email}</li>
              <li><strong>Role:</strong> <span className="capitalize bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">{user.role.toLowerCase()}</span></li>
            </ul>
          </div>
          <div className="flex justify-center pt-4">
             <LogoutButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}