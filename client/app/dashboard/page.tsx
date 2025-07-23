// client/app/dashboard/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import LogoutButton from '@/components/LogoutButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Shield } from 'lucide-react';

// Import the role-specific dashboard components
import StudentDashboard from '@/components/dashboards/StudentDashboard';
import TutorDashboard from '@/components/dashboards/TutorDashboard';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Loader2 className="h-12 w-12 animate-spin text-slate-500" />
      </div>
    );
  }

  // Function to render the correct dashboard based on role
  const renderDashboard = () => {
    switch (user.role) {
      case 'STUDENT':
        return <StudentDashboard />;
      case 'TUTOR':
        return <TutorDashboard />;
      case 'ADMIN':
        // For admins, we can show a simple message or a dedicated admin dashboard component
        return (
            <Card className="bg-red-50 border-red-200">
                <CardHeader>
                    <CardTitle>Admin Access</CardTitle>
                    <CardDescription>You have administrative privileges. Use the button below to access the admin panel.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/admin/tutor-approvals" passHref>
                        <Button variant="destructive">
                            <Shield className="mr-2 h-4 w-4" />
                            Go to Admin Panel
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        );
      default:
        return <p>Your dashboard is not available yet.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h1>
            <p className="text-md text-gray-500 dark:text-gray-400">
              Welcome back, <span className="font-semibold text-indigo-600 dark:text-indigo-400">{user.fullName}!</span>
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <LogoutButton />
          </div>
        </header>

        <main>
          {renderDashboard()}
        </main>
      </div>
    </div>
  );
}
