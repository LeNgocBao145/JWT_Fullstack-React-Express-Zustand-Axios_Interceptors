import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './libs/db.js'
import route from './routes/index.js'
import cookieParser from 'cookie-parser';
import cors from 'cors';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;


// middeware
// This help express understand json format of request body
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true
}

app.use(cors(corsOptions));

route(app);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    })
});
