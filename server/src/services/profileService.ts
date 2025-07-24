import prisma from '../lib/prisma';
import { TutorProfile } from '@prisma/client';

// Define the shape of the input data for creating/updating a profile
type ProfileInput = {
    userId: string;
    bio?: string;
    subjects?: string[];
    hourlyRate?: number;
    languages?: string[];
};

export const upsertTutorProfile = async (data: ProfileInput): Promise<TutorProfile> => {
    const { userId, bio, subjects, hourlyRate, languages } = data;

    // 1. Verify the user is actually a tutor
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user || user.role !== 'TUTOR') {
        throw new Error('User is not a tutor or does not exist.');
    }

    // 2. Use `upsert` to either create a new profile or update an existing one
    const profile = await prisma.tutorProfile.upsert({
        where: { userId: userId }, // The unique identifier for the profile
        update: { // Data to update if the profile exists
            bio,
            subjects,
            hourlyRate,
            languages,
        },
        create: { // Data to use if the profile does not exist
            userId: userId,
            bio,
            subjects,
            hourlyRate,
            languages,
        },
    });

    return profile;
};

export const getTutorProfile = async (userId: string) => {
    const profile = await prisma.tutorProfile.findUnique({
        where: { userId },
        // Also fetch the user's name and email from the related User model
        include: { 
            user: {
                select: {
                    fullName: true,
                    email: true,
                }
            }
        }
    });
    return profile;
}

// New function to get all approved tutors for public display
export const getAllApprovedTutors = async () => {
    const tutors = await prisma.user.findMany({
        where: {
            role: 'TUTOR',
            tutorProfile: {
                isApproved: true, // Only fetch tutors whose profiles are approved
            },
        },
        select: { // Select only the data needed for a public listing
            id: true,
            fullName: true,
            profilePicture: true,
            tutorProfile: {
                select: {
                    bio: true,
                    subjects: true,
                    hourlyRate: true,
                }
            }
        }
    });
    return tutors;
};

export const getPublicTutorProfileById = async (userId: string) => {
    const tutor = await prisma.user.findFirst({
        where: {
            id: userId,
            role: 'TUTOR',
            tutorProfile: { isApproved: true },
        },
        select: {
            id: true,
            fullName: true,
            profilePicture: true,
            createdAt: true,
            tutorProfile: {
                select: {
                    bio: true,
                    subjects: true,
                    hourlyRate: true,
                    languages: true,
                }
            },
            // Include the reviews received by the tutor
            reviewsReceived: {
                select: {
                    id: true,
                    rating: true,
                    comment: true,
                    createdAt: true,
                    student: {
                        select: {
                            fullName: true,
                            profilePicture: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    });

    if (!tutor) return null;

    // Calculate average rating and review count
    const reviewCount = tutor.reviewsReceived.length;
    const averageRating = reviewCount > 0 
        ? tutor.reviewsReceived.reduce((acc, review) => acc + review.rating, 0) / reviewCount 
        : 0;

    return {
        ...tutor,
        reviewStats: {
            count: reviewCount,
            average: parseFloat(averageRating.toFixed(1))
        }
    };
};


