import jwt from 'jsonwebtoken';
import User from '../models/User.js';

//authorization
export const protectedRoute = (req, res, next) => {
    try {        
        // Get access token from header
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

        if(!token){
            return res.status(401).json({message: "Can't find token"});
        }
    
        // Verify access token
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, decodedUser) => {
            if(error){
                console.error(error);
                return res.status(404).json({message: 'Access token is timeout or invalid'});
            }

            //Find User and get all information except hashedPassword
            const user = await User.findById(decodedUser.userId).select('-hashedPassword');

            if(!user){
                return res.status(404).json({message: 'User is not existed!'});
            }

            //Return user in request
            req.user = user;
            next();
        });
    } catch (error) {
        console.error('Error when authentication JWT in authMiddleware', error);
        return res.status(500).json({ message: 'Internal server error' });                        
    }
}