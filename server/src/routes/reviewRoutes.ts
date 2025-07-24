// server/src/routes/reviewRoutes.ts
import { Router } from 'express';
import { createReviewController, getTutorReviewsController } from '../controllers/reviewController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// PUBLIC ROUTE: Get all reviews for a specific tutor
// GET /api/reviews/tutor/:tutorId
router.get('/tutor/:tutorId', getTutorReviewsController);

// PROTECTED ROUTE: Create a new review
// POST /api/reviews
router.post('/', protect, createReviewController);

export default router;
