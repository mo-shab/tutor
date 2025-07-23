// server/src/controllers/adminController.ts
import { Request, Response } from 'express';
import { 
    getAllUsers, 
    setTutorApproval, 
    getPendingTutorProfiles,
    updateUserRole,
    setUserActiveStatus
} from '../services/adminService';
import { UserRole } from '@prisma/client';

export const listUsersController = async (req: Request, res: Response) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'An unexpected error occurred' });
    }
};

export const getPendingTutorsController = async (req: Request, res: Response) => {
    try {
        const pendingProfiles = await getPendingTutorProfiles();
        res.status(200).json(pendingProfiles);
    } catch (error) {
        res.status(500).json({ message: 'An unexpected error occurred' });
    }
};

export const approveTutorController = async (req: Request, res: Response) => {
    try {
        const { tutorProfileId } = req.params;
        const { isApproved } = req.body;

        if (typeof isApproved !== 'boolean') {
            return res.status(400).json({ message: 'isApproved must be a boolean value.' });
        }

        const updatedProfile = await setTutorApproval(tutorProfileId, isApproved);
        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(500).json({ message: 'An unexpected error occurred' });
    }
};

// --- NEW CONTROLLERS FOR USER MANAGEMENT ---

export const updateUserRoleController = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!role || !Object.values(UserRole).includes(role)) {
            return res.status(400).json({ message: 'Invalid role provided.' });
        }

        const updatedUser = await updateUserRole(userId, role);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'An unexpected error occurred' });
    }
};

export const setUserStatusController = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { isActive } = req.body;

        if (typeof isActive !== 'boolean') {
            return res.status(400).json({ message: 'isActive must be a boolean value.' });
        }

        const updatedUser = await setUserActiveStatus(userId, isActive);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'An unexpected error occurred' });
    }
};
