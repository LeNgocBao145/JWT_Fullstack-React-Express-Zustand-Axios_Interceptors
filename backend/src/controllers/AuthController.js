import User from '../models/User.js'
import bcrypt from 'bcrypt';

class AuthController{
    async signup(req, res, next){
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
}

// Create an instance of the controller
const authController = new AuthController();
export default authController;