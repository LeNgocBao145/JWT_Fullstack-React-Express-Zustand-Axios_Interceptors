import express from 'express';
import authController from '../controllers/AuthController.js';

const router = express.Router();

router.post('/signup', authController.signup);

export default router;