import authRouter from './authRoute.js';
import userRouter from './userRoute.js';
import friendRouter from './friendRoute.js';
import messageRouter from './messageRoute.js';
import conversationRouter from './conversationRoute.js';

import { protectedRoute } from '../middlewares/authMiddleware.js';

function route(app) {
    app.use('/api/auth', authRouter);
    app.use(protectedRoute);
    app.use('/api/users', userRouter);
    app.use('/api/friends', friendRouter);
    app.use('/api/messages', messageRouter);
    app.use('/api/conversations', conversationRouter);
}

export default route;