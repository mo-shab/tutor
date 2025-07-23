import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';
import { User } from '@prisma/client';

type UserCreateInput = Omit<User, 'id' | 'role' | 'isActive' | 'profilePicture' | 'createdAt' | 'updatedAt' | 'passwordHash'> & {
    password: string;
};

export const createUser = async (data: UserCreateInput) => {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
        throw new Error('User with this email already exists');
    }
    const passwordHash = await bcrypt.hash(data.password, 10);

    // --- FIX IS HERE ---
    // Create a new user with only the fields defined in the schema
    return prisma.user.create({
        data: {
            fullName: data.fullName,
            email: data.email,
            passwordHash: passwordHash, // Use the hashed password
        },
    });
};

export const validateUserPassword = async (data: { email: string; password: string }) => {
    // Find the user by email
    const user = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (!user) {
        throw new Error('Invalid email or password');
    }

    // Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    return user;
};

export const validateCurrentUser = async (userId: string) => {
    // Find the user by ID
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new Error('User not found');
    }

    return user;
};
