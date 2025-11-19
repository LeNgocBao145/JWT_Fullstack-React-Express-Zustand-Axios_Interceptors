import Friend from '../models/Friend.js';

const pair = (a, b) => (a < b) ? [a, b] : [b, a]

export const checkFriendship = async (req, res, next) => {
    try {        
        const userId = req.user._id;
        const recipientId = req.body?.recipientId ?? null;
    
        if(!recipientId){
            return res.status(403).json({ message: "Recipient Id is required!!" });
        }
    
        const [userA, userB] = pair(userId, recipientId);
        
        // Do NOT use Friend.find() here because find() always returns an array ([] or [...]).
        // An empty array is still truthy, causing `if (!isFriend)` to fail and the middleware
        // will incorrectly allow the request even when the users are NOT friends.
        // Use findOne() instead — it returns `null` when no document is found, which makes the
        // friend check work correctly.
        const isFriend = await Friend.findOne({ userA, userB });
        if(!isFriend){
            return res.status(403).json({ message: "You are not friends with this user!!" });
        }

        return next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error!!" });
    }
}
