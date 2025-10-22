import authRouter from './authRoute.js';
import userRouter from './userRoute.js';
import { protectedRoute } from '../middlewares/authMiddleware.js';

function route(app) {
    app.use('/api/auth', authRouter);
    app.use(protectedRoute);
    app.use('/api/users', userRouter);
}

export default route;