import express from 'express';
import MessageController from '../controllers/MessageController.js';
import { checkFriendship, checkGroupMembership } from '../middlewares/friendMiddleware.js';

const router = express.Router();

router.post('/direct', checkFriendship, MessageController.sendDirectMessage);
router.post('/group', checkGroupMembership, MessageController.sendGroupMessage);

export default router;