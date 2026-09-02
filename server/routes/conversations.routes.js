import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import * as conversationsController from '../controllers/conversations.controller';

const router = Router();

router.get('/', requireAuth, conversationsController.getConversations);
router.post('/', requireAuth, conversationsController.createConversation);
router.get('/:id/messages', requireAuth, conversationsController.getMessages);
router.post('/:id/messages', requireAuth, conversationsController.sendMessage);
router.patch('/:id/read', requireAuth, conversationsController.markAsRead);

export default router;
