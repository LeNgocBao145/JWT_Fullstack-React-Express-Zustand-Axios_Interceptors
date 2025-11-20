import authRouter from './authRoute.js';
import userRouter from './userRoute.js';
import friendRouter from './friendRoute.js';
import messageRouter from './messageRoute.js';
import conversationRouter from './conversationRoute.js';
import { checkFriendship } from '../middlewares/friendMiddleware.js';
import { protectedRoute } from '../middlewares/authMiddleware.js';
import swaggerUi from 'swagger-ui-express';
// Library 'fs' is imported to read files, but it's not used in this code.
import fs from 'fs';

function route(app) {
    const swaggerDocument = JSON.parse(fs.readFileSync('./src/swagger.json', 'utf8'));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use('/api/auth', authRouter);
    app.use(protectedRoute);
    app.use('/api/users', userRouter);
    app.use('/api/friends', friendRouter);
    app.use('/api/messages', checkFriendship, messageRouter);
    app.use('/api/conversations', conversationRouter);
}

export default route;
