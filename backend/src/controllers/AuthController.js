import User from '../models/User.js';
import Session from '../models/Session.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;
const ACCESS_TOKEN_TTL = '30m'; // Max ttl of access token is just 15m

class AuthController{
    async signUp(req, res, next){
        try {
            const { username, password, email, firstName, lastName } = req.body;

            if(!username || !password || !email || !firstName || !lastName){
                return  res.status(400).json({ message: 'All fields are required' });
            }
    
            //Check if there already exist username
            const duplicate = await User.findOne({username});

            if(duplicate){
                return res.status(409).json({ message: 'Username already exists' });
            }
    
            const hashedPassword = await bcrypt.hash(password, 10); // salt=10
            
            // create new user 
            User.create({
                username,
                hashedPassword,
                email,
                displayName: `${firstName} ${lastName}`,
            })

            return res.sendStatus(204);
        } catch (error) {
            console.error('Error when signing up', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async signIn(req, res, next){
        try {            
            const { username, password } = req.body;
    
            if(!username || !password){
                return res.status(400).json({message: 'Username and password are required'});
            }
    
            const authUser = await User.findOne({username});
    
            if(!authUser){
                return res.status(404).json({message: 'User does not exist!!!'});
            }
    
            const isPass = await bcrypt.compare(password, authUser.hashedPassword);

            if(!isPass){
                return res.status(401).json({message: 'Wrong username or password'});
            }

            //Create access token using JWT if user is authenticated
            const accessToken = jwt.sign({userId: authUser._id}, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: ACCESS_TOKEN_TTL,
            });

            //Create refresh token
            const refreshToken = crypto.randomBytes(64).toString('hex');

            Session.create({
                userId: authUser._id,
                refreshToken,
                expiredAt: new Date(Date.now() + REFRESH_TOKEN_TTL)
            });

            //Return refreshToken through cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: "none",
                secure: true,
                maxAge: REFRESH_TOKEN_TTL
            })

            return res.status(200).json({message: `User ${authUser.displayName} logged in`, accessToken});
        } catch (error) {
            console.error('Error when signing in', error);
            return res.status(500).json({ message: 'Internal server error' });            
        }



    }

    async signOut(req, res, next){
        try {
            const refreshToken = req.cookies?.refreshToken;

            if(refreshToken){
                // Delete refresh token in session
                await Session.deleteOne({refreshToken});

                //Delete cookie
                res.clearCookie('refreshToken');
            }

            return res.sendStatus(204);
        } catch (error) {
            console.error('Error when signing out', error);
            return res.status(500).json({ message: 'Internal server error' });        
        }
    }
}

// Create an instance of the controller
const authController = new AuthController();
export default authController;