import { Request, Response } from 'express';
import { createUser, validateUserPassword } from '../services/userService';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../lib/prisma';


export const registerUser = async (req: Request, res: Response) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const user = await createUser({ fullName, email, password });
        const { passwordHash, ...userWithoutPassword } = user;
        return res.status(201).json(userWithoutPassword);
    } catch (error) {
        if (error instanceof Error && error.message.includes('already exists')) {
            return res.status(409).json({ message: error.message });
        }
        return res.status(500).json({ message: 'An unexpected error occurred' });
    }
};


export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await validateUserPassword({ email, password });

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );

        // Set token in an HTTP-Only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict', // Strict same-site policy
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        const { passwordHash, ...userWithoutPassword } = user;
        return res.status(200).json({ user: userWithoutPassword });

    } catch (error) {
        if (error instanceof Error && error.message.includes('Invalid')) {
            return res.status(401).json({ message: error.message });
        }
        return res.status(500).json({ message: 'An unexpected error occurred' });
    }
};

export const logoutUser = (req: Request, res: Response) => {
    // Clear the cookie
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
};


export const getCurrentUser = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(400).json({ message: 'User ID not found in token' });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
            },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'An unexpected error occurred' });
    }
};