// client/app/find-a-tutor/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Route, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define the shape of the tutor data we expect from the API
interface Tutor {
    id: string;
    fullName: string;
    profilePicture: string | null;
    tutorProfile: {
        bio: string | null;
        subjects: string[];
        hourlyRate: number | null;
    };
}

export default function FindATutorPage() {
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTutors = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/profiles');
                if (!res.ok) {
                    throw new Error('Failed to fetch tutors.');
                }
                const data = await res.json();
                setTutors(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTutors();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-slate-500" />
            </div>
        );
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Find Your Perfect Tutor</h1>
                    <p className="mt-4 text-lg text-gray-600">Browse our community of expert tutors ready to help you succeed.</p>
                </div>

                {tutors.length === 0 ? (
                    <p className="text-center text-gray-500">No approved tutors found at the moment. Please check back later.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tutors.map((tutor) => (
                            <Card key={tutor.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardHeader className="flex flex-row items-center gap-4 p-6">
                                    {tutor.profilePicture ? (
                                        <img src={tutor.profilePicture} alt={tutor.fullName} className="w-16 h-16 rounded-full object-cover" />
                                    ) : (
                                        <UserCircle className="w-16 h-16 text-gray-400" />
                                    )}
                                    <div>
                                        <CardTitle className="text-xl">{tutor.fullName}</CardTitle>
                                        {tutor.tutorProfile?.hourlyRate && (
                                            <CardDescription className="text-lg font-semibold text-indigo-600">
                                                ${tutor.tutorProfile.hourlyRate}/hr
                                            </CardDescription>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow p-6 pt-0">
                                    <div className="mb-4">
                                        {tutor.tutorProfile?.subjects.map((subject) => (
                                            <Badge key={subject} variant="secondary" className="mr-2 mb-2">{subject}</Badge>
                                        ))}
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 h-[60px]">
                                        {tutor.tutorProfile?.bio || 'No bio provided.'}
                                    </p>
                                    <Button variant="outline" className="w-full"><Route className="mr-2 h-5 w-5" />
                                        <a href={`/tutor/${tutor.id}`}>View Profile</a>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
