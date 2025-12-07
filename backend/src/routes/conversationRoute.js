import express from 'express';
import { checkFriendship } from '../middlewares/friendMiddleware.js';
import ConversationController from '../controllers/ConversationController.js';

const router = express.Router();

router.get('/', ConversationController.getConversations);
router.post('/', checkFriendship, ConversationController.createConversation);
router.get('/:conversationId/messages', ConversationController.getMessages);
// router.put('/:conversationId/seen');

export default router;