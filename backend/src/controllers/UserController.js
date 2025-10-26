class UserController{
    async authMe(req, res, next){
        try {
            // Get user from authMiddleware
            const user = req.user;

            if(!user){
                return res.status(404).json({message: "Error in authMiddleware"});
            }

            return res.status(200).json({user});
        } catch (error) {
            console.error('Error when call authMe', error);
            return res.status(500).json({ message: 'Internal server error' });                
        }
    }

    async test(req, res, next){
        try {
            return res.sendStatus(204);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });   
        }
    }
}

export default new UserController();