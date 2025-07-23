// server/src/services/adminService.ts
import prisma from '../lib/prisma';
import { UserRole } from '@prisma/client';

// Service to get a list of all users
export const getAllUsers = async () => {
    return prisma.user.findMany({
        select: { // Select only non-sensitive data
            id: true,
            fullName: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
};

// Service to approve or deny a tutor's profile
export const setTutorApproval = async (tutorProfileId: string, isApproved: boolean) => {
    return prisma.tutorProfile.update({
        where: { id: tutorProfileId },
        data: { isApproved },
    });
};

// Service to get all tutor profiles awaiting approval
export const getPendingTutorProfiles = async () => {
    return prisma.tutorProfile.findMany({
        where: { isApproved: false },
        include: {
            user: {
                select: {
                    fullName: true,
                    email: true,
                }
            }
        }
    });
};

// --- NEW FUNCTIONS FOR USER MANAGEMENT ---

// Service to update a user's role
export const updateUserRole = async (userId: string, newRole: UserRole) => {
    return prisma.user.update({
        where: { id: userId },
        data: { role: newRole },
    });
};

// Service to update a user's active status (ban/unban)
export const setUserActiveStatus = async (userId: string, isActive: boolean) => {
    return prisma.user.update({
        where: { id: userId },
        data: { isActive },
    });
};
