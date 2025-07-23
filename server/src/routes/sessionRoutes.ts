import { Router } from 'express';
import { 
    requestSessionController, 
    getTutorSessionsController,
    updateSessionStatusController,
    getStudentSessionsController
} from '../controllers/sessionController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.post('/', requestSessionController);

router.get('/tutor', getTutorSessionsController);
router.get('/student', getStudentSessionsController);
router.patch('/:sessionId/status', updateSessionStatusController);


export default router;