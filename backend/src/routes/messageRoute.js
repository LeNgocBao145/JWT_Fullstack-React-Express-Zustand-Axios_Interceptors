import express from 'express';
import MessageController from '../controllers/MessageController.js';

const router = express.Router();

router.post('/direct', MessageController.sendDirectMessage);
// router.post('/group', MessageController.sendGroupMessage);

export default router;