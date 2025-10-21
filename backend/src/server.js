import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './libs/db.js'

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// middeware
// This help express understand json format of request body
app.use(express.json());

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    })
});
