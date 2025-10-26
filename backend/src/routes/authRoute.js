import express from 'express';
import AuthController from '../controllers/AuthController.js';

const router = express.Router();

router.post('/signup', AuthController.signUp);
router.post('/signin', AuthController.signIn);
router.post('/signout', AuthController.signOut);
router.post('/refresh', AuthController.refreshToken);

export default router;