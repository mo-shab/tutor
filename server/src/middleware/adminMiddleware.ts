import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Access is restricted to administrators.' });
    }
};
