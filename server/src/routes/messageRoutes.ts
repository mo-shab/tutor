import { Router } from 'express';
import { 
    getMyConversationsController,
    getMessagesController,
    sendMessageController,
    markAsReadController // Import new controller
} from '../controllers/messageController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', getMyConversationsController);
router.get('/:conversationId', getMessagesController);
router.post('/', sendMessageController);

// New route to mark a conversation as read
router.patch('/:conversationId/read', markAsReadController);

export default router;
