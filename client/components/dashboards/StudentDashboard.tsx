'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, Calendar, History } from 'lucide-react';

export default function StudentDashboard() {
    return (
        <div className="space-y-6">
            {/* Find a Tutor Call to Action */}
            <Card className="bg-indigo-50 border-indigo-200">
                <CardHeader>
                    <CardTitle>Ready to Learn?</CardTitle>
                    <CardDescription>Browse our qualified tutors to find the perfect match for your learning goals.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/find-a-tutor" passHref>
                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                            <Search className="mr-2 h-4 w-4" />
                            Find a Tutor
                        </Button>
                    </Link>
                </CardContent>
            </Card>

            {/* Placeholder for Upcoming Sessions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><Calendar className="mr-2 h-5 w-5 text-gray-500" /> Upcoming Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-500">You have no upcoming sessions scheduled.</p>
                </CardContent>
            </Card>

            {/* Placeholder for Past Sessions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><History className="mr-2 h-5 w-5 text-gray-500" /> Session History</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-500">You have no completed sessions.</p>
                </CardContent>
            </Card>
        </div>
    );
}