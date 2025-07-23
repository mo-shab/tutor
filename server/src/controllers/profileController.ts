import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { upsertTutorProfile, getTutorProfile, getAllApprovedTutors, getPublicTutorProfileById } from '../services/profileService';

// Controller to get the current tutor's own profile
export const getMyProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(400).json({ message: 'User ID not found in token' });
        }

        const profile = await getTutorProfile(userId);

        if (!profile) {
            return res.status(200).json(null);
        }

        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: 'An unexpected error occurred' });
    }
};

// Controller to create or update the current tutor's profile
export const updateMyProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(400).json({ message: 'User ID not found in token' });
        }

        if (req.user?.role !== 'TUTOR') {
            return res.status(403).json({ message: 'Forbidden: Only tutors can update a profile.' });
        }

        const profileData = req.body;

        const updatedProfile = await upsertTutorProfile({
            userId,
            ...profileData
        });

        res.status(200).json(updatedProfile);

    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'An unexpected error occurred' });
    }
};

export const listPublicTutors = async (req: Request, res: Response) => {
    try {
        const tutors = await getAllApprovedTutors();
        res.status(200).json(tutors);
    } catch (error) {
        res.status(500).json({ message: 'An unexpected error occurred' });
    }
};

export const getPublicTutorProfileByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Get ID from URL parameters
        const tutor = await getPublicTutorProfileById(id);
        if (!tutor) {
            return res.status(404).json({ message: 'Tutor not found or not approved.' });
        }
        res.status(200).json(tutor);
    } catch (error) {
        res.status(500).json({ message: 'An unexpected error occurred' });
    }
};