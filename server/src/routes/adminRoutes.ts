// server/src/routes/adminRoutes.ts
import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { isAdmin } from '../middleware/adminMiddleware';
import { 
    listUsersController, 
    getPendingTutorsController,
    approveTutorController,
    updateUserRoleController,
    setUserStatusController
} from '../controllers/adminController';

const router = Router();

// Apply protect and isAdmin middleware to all routes in this file
router.use(protect, isAdmin);

// --- User Management ---
// GET /api/admin/users - List all users
router.get('/users', listUsersController);
// PATCH /api/admin/users/:userId/role - Update a user's role
router.patch('/users/:userId/role', updateUserRoleController);
// PATCH /api/admin/users/:userId/status - Update a user's active status
router.patch('/users/:userId/status', setUserStatusController);


// --- Tutor Management ---
// GET /api/admin/tutors/pending - Get tutor profiles awaiting approval
router.get('/tutors/pending', getPendingTutorsController);
// PATCH /api/admin/tutors/:tutorProfileId/approve - Approve or deny a tutor profile
router.patch('/tutors/:tutorProfileId/approve', approveTutorController);

export default router;
