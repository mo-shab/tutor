import { Router } from 'express';
import { registerUser, loginUser, getCurrentUser, logoutUser } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.post('/auth/logout', logoutUser); // Add logout route

// Protected route
router.get('/users/me', protect, getCurrentUser);

export default router;
