import mongoose from 'mongoose';

export const connectDB = async () => {
    try {        
        await mongoose.connect(process.env.MONGODB_CONNECTION_URL);
        console.log("Connect database successfully!!!");
    } catch (error) {
        console.log("Connect database fail!!!");
        process.exit(1);
    }
}