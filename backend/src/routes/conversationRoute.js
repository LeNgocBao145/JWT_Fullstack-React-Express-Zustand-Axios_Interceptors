import express from 'express';
import ConversationController from '../controllers/ConversationController.js';

const router = express.Router();

router.get('/', ConversationController.getConversations);
router.post('/', ConversationController.createConversation);
router.get('/:conversationId/message', ConversationController.getMessages);
// router.put('/:conversationId/seen');

export default router;