// client/app/tutor/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, UserCircle, BookOpen, MessageSquare, CalendarPlus, Languages, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BookingModal from '@/components/modals/BookingModal';
import SendMessageModal from '@/components/modals/SendMessageModal'; // Import the new modal

// Define the shape of the detailed tutor data
interface DetailedTutor {
    id: string;
    fullName: string;
    profilePicture: string | null;
    createdAt: string;
    tutorProfile: {
        bio: string | null;
        subjects: string[];
        hourlyRate: number | null;
        languages: string[];
    };
}

export default function TutorPublicProfilePage() {
    const params = useParams();
    const tutorId = params.id as string;

    const [tutor, setTutor] = useState<DetailedTutor | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false); // New state for message modal

    useEffect(() => {
        if (!tutorId) return;

        const fetchTutorProfile = async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/profiles/${tutorId}`);
                if (!res.ok) {
                    throw new Error('Tutor not found.');
                }
                const data = await res.json();
                setTutor(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTutorProfile();
    }, [tutorId]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-slate-500" />
            </div>
        );
    }

    if (error || !tutor) {
        return <div className="text-center py-10 text-red-500">{error || 'Could not load tutor profile.'}</div>;
    }

    return (
        <>
            {/* The Booking Modal */}
            <BookingModal 
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                tutorId={tutor.id}
                tutorName={tutor.fullName}
            />

            {/* The Send Message Modal */}
            <SendMessageModal
                isOpen={isMessageModalOpen}
                onClose={() => setIsMessageModalOpen(false)}
                tutorId={tutor.id}
                tutorName={tutor.fullName}
            />

            <div className="bg-gray-50 min-h-screen p-4 md:p-8">
                <div className="container mx-auto max-w-4xl">
                    {/* Back Button */}
                    <div className="mb-6">
                        <Link href="/find-a-tutor" passHref>
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Tutors
                            </Button>
                        </Link>
                    </div>
                    
                    <Card className="overflow-hidden shadow-xl">
                        <CardHeader className="bg-gray-100 p-8 md:flex-row flex-col flex items-start gap-8">
                            {tutor.profilePicture ? (
                                <img src={tutor.profilePicture} alt={tutor.fullName} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md" />
                            ) : (
                                <UserCircle className="w-32 h-32 text-gray-400" />
                            )}
                            <div className="flex-grow">
                                <h1 className="text-4xl font-bold">{tutor.fullName}</h1>
                                {tutor.tutorProfile.hourlyRate && (
                                    <p className="text-2xl font-semibold text-indigo-600 mt-1">${tutor.tutorProfile.hourlyRate} / hour</p>
                                )}
                                <p className="text-sm text-gray-500 mt-2">Tutor since {new Date(tutor.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                            </div>
                            <div className="flex flex-col space-y-2 w-full md:w-auto mt-4 md:mt-0">
                                <Button size="lg" className="w-full" onClick={() => setIsBookingModalOpen(true)}>
                                    <CalendarPlus className="mr-2 h-5 w-5"/> Book a Session
                                </Button>
                                <Button size="lg" variant="outline" className="w-full" onClick={() => setIsMessageModalOpen(true)}>
                                    <MessageSquare className="mr-2 h-5 w-5"/> Send Message
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="space-y-2">
                                <CardTitle className="text-xl">About Me</CardTitle>
                                <p className="text-gray-700 whitespace-pre-wrap">{tutor.tutorProfile.bio || 'This tutor has not provided a bio yet.'}</p>
                            </div>
                            <div className="space-y-2">
                                <CardTitle className="text-xl flex items-center"><BookOpen className="mr-2 h-5 w-5 text-gray-500"/> Subjects</CardTitle>
                                <div className="flex flex-wrap gap-2">
                                    {tutor.tutorProfile.subjects.map(subject => <Badge key={subject}>{subject}</Badge>)}
                                </div>
                            </div>
                             <div className="space-y-2">
                                <CardTitle className="text-xl flex items-center"><Languages className="mr-2 h-5 w-5 text-gray-500"/> Languages</CardTitle>
                                <div className="flex flex-wrap gap-2">
                                    {tutor.tutorProfile.languages.map(lang => <Badge variant="outline" key={lang}>{lang}</Badge>)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
