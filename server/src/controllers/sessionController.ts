import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { createSession, getSessionsForTutor, updateSessionStatus, getSessionsForStudent } from '../services/sessionService';
import { SessionStatus } from '@prisma/client';

export const requestSessionController = async (req: AuthRequest, res: Response) => {
    try {
        const studentId = req.user?.userId;
        if (!studentId) {
            return res.status(400).json({ message: 'User ID not found in token' });
        }

        if (req.user?.role !== 'STUDENT') {
            return res.status(403).json({ message: 'Forbidden: Only students can book sessions.' });
        }

        const { tutorId, subject, scheduledAt, duration } = req.body;

        if (!tutorId || !subject || !scheduledAt || !duration) {
            return res.status(400).json({ message: 'Missing required fields for session booking.' });
        }

        const session = await createSession({
            studentId,
            tutorId,
            subject,
            scheduledAt: new Date(scheduledAt),
            duration,
        });

        res.status(201).json(session);

    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'An unexpected error occurred while booking the session.' });
    }
};

// New controller for a tutor to get their sessions
export const getTutorSessionsController = async (req: AuthRequest, res: Response) => {
    try {
        const tutorId = req.user?.userId;
        if (!tutorId) {
            return res.status(400).json({ message: 'User ID not found in token' });
        }

        if (req.user?.role !== 'TUTOR') {
            return res.status(403).json({ message: 'Forbidden: Only tutors can view sessions.' });
        }

        const sessions = await getSessionsForTutor(tutorId);
        res.status(200).json(sessions);

    } catch (error) {
        res.status(500).json({ message: 'An unexpected error occurred.' });
    }
};

export const getStudentSessionsController = async (req: AuthRequest, res: Response) => {
    try {
        const studentId = req.user?.userId;
        if (!studentId) {
            return res.status(400).json({ message: 'User ID not found in token' });
        }

        if (req.user?.role !== 'STUDENT') {
            return res.status(403).json({ message: 'Forbidden: Only students can view their sessions.' });
        }

        const sessions = await getSessionsForStudent(studentId);
        res.status(200).json(sessions);

    } catch (error) {
        res.status(500).json({ message: 'An unexpected error occurred.' });
    }
};

export const updateSessionStatusController = async (req: AuthRequest, res: Response) => {
    try {
        const tutorId = req.user?.userId;
        const { sessionId } = req.params;
        const { status } = req.body;

        if (!tutorId) {
            return res.status(400).json({ message: 'User ID not found in token' });
        }
        if (req.user?.role !== 'TUTOR') {
            return res.status(403).json({ message: 'Forbidden: Only tutors can update sessions.' });
        }
        if (!status || !Object.values(SessionStatus).includes(status)) {
            return res.status(400).json({ message: 'Invalid status provided.' });
        }

        const updatedSession = await updateSessionStatus(sessionId, tutorId, status);
        res.status(200).json(updatedSession);

    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'An unexpected error occurred.' });
    }
};
