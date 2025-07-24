// server/src/controllers/reviewController.ts
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { createReview, getReviewsForTutor } from '../services/reviewService';

export const createReviewController = async (req: AuthRequest, res: Response) => {
    try {
        const studentId = req.user?.userId;
        if (!studentId) {
            return res.status(400).json({ message: 'User ID not found in token.' });
        }

        const { sessionId, rating, comment } = req.body;

        if (!sessionId || !rating) {
            return res.status(400).json({ message: 'Session ID and rating are required.' });
        }
        if (typeof rating !== 'number' || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be a number between 1 and 5.' });
        }

        const review = await createReview({ studentId, sessionId, rating, comment });
        res.status(201).json(review);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'An unexpected error occurred.' });
    }
};

export const getTutorReviewsController = async (req: Request, res: Response) => {
    try {
        const { tutorId } = req.params;
        const reviews = await getReviewsForTutor(tutorId);
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'An unexpected error occurred.' });
    }
};
