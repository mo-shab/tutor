// client/app/tutor/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Save } from 'lucide-react';

// Define the shape of the profile data
interface ProfileData {
    bio: string;
    subjects: string; // We'll use a comma-separated string for simplicity in the form
    hourlyRate: number | string;
    languages: string; // Comma-separated string
}

export default function TutorProfilePage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();
    
    const [profile, setProfile] = useState<ProfileData>({
        bio: '',
        subjects: '',
        hourlyRate: '',
        languages: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Fetch existing profile data on component mount
    useEffect(() => {
        if (isAuthLoading) return; // Wait for auth check to complete

        if (!user) {
            router.push('/login');
            return;
        }
        if (user.role !== 'TUTOR') {
            router.push('/dashboard');
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/profiles/me', {
                    credentials: 'include',
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data) {
                        setProfile({
                            bio: data.bio || '',
                            subjects: data.subjects?.join(', ') || '',
                            hourlyRate: data.hourlyRate || '',
                            languages: data.languages?.join(', ') || '',
                        });
                    }
                }
            } catch (err) {
                setError('Failed to load profile data.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [user, isAuthLoading, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const submissionData = {
            ...profile,
            // Convert comma-separated strings back to arrays
            subjects: profile.subjects.split(',').map(s => s.trim()).filter(Boolean),
            languages: profile.languages.split(',').map(l => l.trim()).filter(Boolean),
            // Ensure hourlyRate is a number
            hourlyRate: Number(profile.hourlyRate) || null,
        };

        try {
            const res = await fetch('http://localhost:8000/api/profiles/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(submissionData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to update profile.');
            }
            // Optionally show a success message
            alert('Profile updated successfully!');

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading || isAuthLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-slate-500" />
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
            <Card className="w-full max-w-3xl">
                <CardHeader>
                    <CardTitle className="text-2xl">Manage Your Tutor Profile</CardTitle>
                    <CardDescription>Keep your information up to date to attract more students.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="bio">Your Bio</Label>
                            <Textarea id="bio" name="bio" value={profile.bio} onChange={handleChange} placeholder="Tell students about your teaching style and experience." rows={5} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="subjects">Subjects</Label>
                                <Input id="subjects" name="subjects" value={profile.subjects} onChange={handleChange} placeholder="e.g., Math, Physics, French" />
                                <p className="text-xs text-gray-500">Separate subjects with a comma.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                                <Input id="hourlyRate" name="hourlyRate" type="number" value={profile.hourlyRate} onChange={handleChange} placeholder="e.g., 50" />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="languages">Languages</Label>
                            <Input id="languages" name="languages" value={profile.languages} onChange={handleChange} placeholder="e.g., English, Spanish" />
                             <p className="text-xs text-gray-500">Separate languages with a comma.</p>
                        </div>
                        
                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
