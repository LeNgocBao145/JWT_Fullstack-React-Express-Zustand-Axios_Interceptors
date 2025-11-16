import express from 'express';
import FriendController from '../controllers/FriendController.js';

const router = express.Router();

router.post('/requests', FriendController.sendFriendRequest);
router.post('/requests/:requestId/accept', FriendController.acceptFriendRequest);
router.post('/requests/:requestId/decline', FriendController.declineFriendRequest);
router.get('/', FriendController.getFriends);
router.get('/requests', FriendController.getFriendRequests);

export default router;