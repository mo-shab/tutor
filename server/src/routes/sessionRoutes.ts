import { Router } from 'express';
import { 
    requestSessionController, 
    getTutorSessionsController,
    updateSessionStatusController,
    getStudentSessionsController,
    markSessionAsCompletedController // Import new controller
} from '../controllers/sessionController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

// Student routes
router.post('/', requestSessionController);
router.get('/student', getStudentSessionsController);

// Tutor routes
router.get('/tutor', getTutorSessionsController);
router.patch('/:sessionId/status', updateSessionStatusController);
// New route for marking a session as completed
router.patch('/:sessionId/complete', markSessionAsCompletedController);

export default router;