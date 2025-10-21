import authRouter from './authRoute.js'

function route(app) {
    app.use('/api/auth', authRouter);
}

export default route;