// server/src/services/sessionService.ts
import prisma from '../lib/prisma';
import { Prisma, SessionStatus } from '@prisma/client';

// Define the shape of the input data for creating a session
type SessionInput = {
    studentId: string;
    tutorId: string;
    subject: string;
    scheduledAt: Date;
    duration: number; // in minutes
};

export const createSession = async (data: SessionInput) => {
    const { studentId, tutorId, subject, scheduledAt, duration } = data;

    // Use a transaction with the highest isolation level to prevent race conditions
    return prisma.$transaction(async (tx) => {
        // 1. Verify the student and tutor exist and have the correct roles
        const student = await tx.user.findFirst({ where: { id: studentId, role: 'STUDENT' } });
        if (!student) throw new Error('Requesting user is not a valid student.');

        const tutor = await tx.user.findFirst({ where: { id: tutorId, role: 'TUTOR' } });
        if (!tutor) throw new Error('The selected user is not a valid tutor.');

        // 2. Define the start and end times for the requested session
        const requestedStartTime = new Date(scheduledAt);
        const requestedEndTime = new Date(requestedStartTime.getTime() + duration * 60000);

        // 3. Fetch all potentially conflicting sessions for the tutor
        const potentialConflicts = await tx.session.findMany({
            where: {
                tutorId: tutorId,
                status: { in: ['PENDING', 'ACCEPTED'] },
            },
        });

        // 4. Manually check for a true overlap in the application logic
        const hasOverlap = potentialConflicts.some(existingSession => {
            const existingStartTime = new Date(existingSession.scheduledAt);
            const existingEndTime = new Date(existingStartTime.getTime() + existingSession.duration * 60000);

            // The overlap condition: (StartA < EndB) and (EndA > StartB)
            return requestedStartTime < existingEndTime && requestedEndTime > existingStartTime;
        });

        if (hasOverlap) {
            throw new Error('This time slot is no longer available. Please choose another time.');
        }

        // 5. If no conflicts, create the new session
        const session = await tx.session.create({
            data: {
                studentId,
                tutorId,
                subject,
                scheduledAt: requestedStartTime,
                duration,
            },
        });

        return session;
    }, {
        // THIS IS THE FIX: Set the isolation level to Serializable
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    });
};


// --- Other service functions remain the same ---

export const getSessionsForTutor = async (tutorId: string) => {
    return prisma.session.findMany({
        where: { tutorId },
        include: {
            student: {
                select: { fullName: true }
            }
        },
        orderBy: {
            scheduledAt: 'asc'
        }
    });
};

export const getSessionsForStudent = async (studentId: string) => {
    return prisma.session.findMany({
        where: { studentId },
        include: {
            tutor: {
                select: {
                    id: true, // Also include tutor's ID for the review modal
                    fullName: true
                }
            },
            review: { // Include the review relation to check if a session has been reviewed
                select: {
                    id: true
                }
            }
        },
        orderBy: {
            scheduledAt: 'asc'
        }
    });
};

export const updateSessionStatus = async (sessionId: string, tutorId: string, newStatus: SessionStatus) => {
    const session = await prisma.session.findFirst({
        where: {
            id: sessionId,
            tutorId: tutorId,
        }
    });

    if (!session) {
        throw new Error('Session not found or you do not have permission to update it.');
    }

    return prisma.session.update({
        where: { id: sessionId },
        data: { status: newStatus },
    });
};

export const markSessionAsCompleted = async (sessionId: string, tutorId: string) => {
    const session = await prisma.session.findFirst({
        where: {
            id: sessionId,
            tutorId: tutorId,
        }
    });

    if (!session) {
        throw new Error('Session not found or you do not have permission to update it.');
    }
    if (session.status !== 'ACCEPTED') {
        throw new Error('Only accepted sessions can be marked as completed.');
    }
    if (new Date(session.scheduledAt) > new Date()) {
        throw new Error('Cannot mark a session as completed before its scheduled time.');
    }

    return prisma.session.update({
        where: { id: sessionId },
        data: { status: 'COMPLETED' },
    });
};
