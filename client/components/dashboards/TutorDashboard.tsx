'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Edit, CalendarCheck, DollarSign } from 'lucide-react';

export default function TutorDashboard() {
    return (
        <div className="space-y-6">
            {/* Manage Profile Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Manage Your Profile</CardTitle>
                    <CardDescription>Keep your information up to date to attract more students.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/tutor/profile" passHref>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Your Tutor Profile
                        </Button>
                    </Link>
                </CardContent>
            </Card>

            {/* Placeholder for Session Requests */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><CalendarCheck className="mr-2 h-5 w-5 text-gray-500" /> Session Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-500">You have no new session requests.</p>
                </CardContent>
            </Card>

            {/* Placeholder for Earnings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><DollarSign className="mr-2 h-5 w-5 text-gray-500" /> My Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-500">Earnings data is not yet available.</p>
                </CardContent>
            </Card>
        </div>
    );
}
