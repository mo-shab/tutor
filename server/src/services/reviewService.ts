// server/src/services/reviewService.ts
import prisma from '../lib/prisma';

type ReviewInput = {
    studentId: string;
    sessionId: string;
    rating: number;
    comment?: string;
};

export const createReview = async (data: ReviewInput) => {
    const { studentId, sessionId, rating, comment } = data;

    // 1. Verify the session exists and belongs to the student
    const session = await prisma.session.findFirst({
        where: {
            id: sessionId,
            studentId: studentId,
        }
    });

    if (!session) {
        throw new Error('Session not found or you do not have permission to review it.');
    }

    // 2. Check if the session is completed
    if (session.status !== 'COMPLETED') {
        throw new Error('You can only review completed sessions.');
    }

    // 3. Check if a review for this session already exists (the unique constraint on sessionId handles this too)
    const existingReview = await prisma.review.findUnique({
        where: { sessionId }
    });

    if (existingReview) {
        throw new Error('A review for this session has already been submitted.');
    }

    // 4. Create the new review
    return prisma.review.create({
        data: {
            rating,
            comment,
            sessionId,
            studentId,
            tutorId: session.tutorId, // Get the tutorId from the session
        }
    });
};

// Service to get all reviews for a specific tutor
export const getReviewsForTutor = async (tutorId: string) => {
    return prisma.review.findMany({
        where: { tutorId },
        include: {
            // Include the student's name for display
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
    });
};
