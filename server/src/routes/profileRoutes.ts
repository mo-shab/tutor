import { Router } from 'express';
import { 
    getMyProfile, 
    updateMyProfile, 
    listPublicTutors,
    getPublicTutorProfileByIdController // Import new controller
} from '../controllers/profileController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// PUBLIC ROUTES
// GET /api/profiles - List all approved tutors
router.get('/', listPublicTutors);

// GET /api/profiles/:id - Get a single public tutor profile
router.get('/:id', getPublicTutorProfileByIdController);


// PROTECTED ROUTES
router.use(protect);
router.get('/me', getMyProfile);
router.put('/me', updateMyProfile);

export default router;
