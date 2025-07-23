'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LogoutButton from '@/components/LogoutButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Edit } from 'lucide-react';

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
        <CardContent className="space-y-6">
          <div className="p-4 border rounded-lg bg-slate-50">
            <h3 className="font-semibold">Your Profile Details:</h3>
            <ul className="mt-2 list-disc list-inside text-gray-700">
              <li><strong>Email:</strong> {user.email}</li>
              <li><strong>You are a :</strong> <span className="capitalize bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">{user.role.toLowerCase()}</span></li>
            </ul>
          </div>
          
          {/* Conditionally render the button for Tutors */}
          {user.role === 'TUTOR' && (
            <div className="p-4 border-2 border-dashed rounded-lg">
              <h3 className="text-lg font-semibold">Tutor Actions</h3>
              <p className="text-sm text-gray-600 mb-4">Manage your public profile to attract students.</p>
              <Link href="/tutor/profile" passHref>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Your Tutor Profile
                </Button>
              </Link>
            </div>
          )}

          <div className="flex justify-center pt-4">
             <LogoutButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}