import Friend from '../models/Friend.js';
import User from '../models/User.js';
import FriendRequest from '../models/FriendRequest.js';

class FriendController {
    async sendFriendRequest(req, res, next) {
        try {
            const { to, message } = req.body;

            const from = req.user._id;

            const isExistedUser = await User.exists({ _id: to });

            if(!isExistedUser){
                return res.status(400).json({ message: 'User does not exist!' });
            }

            if(from === to) {
                return res.status(400).json({ message: 'You cannot add yourself as a friend!' });
            }

            const userA = from.toString();
            const userB = to.toString();

            if(userA > userB){
                [userA, userB] = [userB, userA];
            }

            const [isAlreadyFriend, isExistingRequest] = await Promise.all([
                Friend.findOne({ userA, userB }),
                FriendRequest.findOne({
                    $or: [
                        { from, to },
                        { from: to, to: from }
                    ]
                })
            ]);

            if(isAlreadyFriend){
                return res.status(400).json({ message: 'You are already friends!' });
            }

            if(isExistingRequest){
                return res.status(400).json({ message: 'You have sent or received request!' });
            }

            const request = await FriendRequest.create({
                from, 
                to, 
                message
            });

            return res.status(200).json({ message: 'Sent friend request successfully!', request });
        } catch (error) {
            console.error('Error when add friend', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async acceptFriendRequest(req, res, next) {
        try {
            const userId = req.user._id;
            const {requestId} = req.params;
            if(!requestId){
                return res.status(404).json({ message: 'Lack of id!' });
            }

            const request = await FriendRequest.findOne({ _id: requestId });

            if(!request){
                return res.status(404).json({ message: 'Friend request does not exist!!' });
            }


            if(request.to.toString() !== userId.toString()){
                return res.status(403).json({ message: 'You are not allowed to accept this request!!' });
            }

            const friend = await Friend.create({
                userA: request.from,
                userB: request.to
            });

            await FriendRequest.findByIdAndDelete({ _id: requestId });

            // We use lean here to optimize performance of query
            // It will return Javascript object instead of mongoose document
            const from = await User.findById(request.from).select('_id displayName avatarUrl').lean();

            return res.status(201).json({ message: 'Accept friend request successfully!!', newFriend: {
                _id: from?._id,
                displayName: from?.displayName,
                avatarUrl: from?.avatarUrl,
            } });
        } catch (error) {
            console.error('Error when accept friend request', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async declineFriendRequest(req, res, next) {
        try {
            const userId = req.user._id;
            const requestId = req.params.requestId;
            if(!requestId){
                return res.status(404).json({ message: 'Lack of id!' });
            }

            const request = await FriendRequest.findOne({ _id: requestId });

            if(!request){
                return res.status(404).json({ message: 'Request does not exist!!' });
            }

            if(request.to.toString() !== userId.toString()){
                return res.status(403).json({ message: 'You are not allowed to decline this request!!' });
            }

            await FriendRequest.findByIdAndDelete({ _id: requestId });

            return res.status(201).json({ message: 'Decline friend request successfully!!' });
        } catch (error) {
            console.error('Error when decline friend request', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async getFriendRequests(req, res, next) {
        try {
            const userId = req.user._id;

            const populatedFields = "_id username displayName avatarUrl";

            const [sent, received] = await Promise.all([
                FriendRequest.find({ from: userId }).populate("to", populatedFields),
                FriendRequest.find({ to: userId }).populate("from", populatedFields),
            ]);

            return res.status(200).json({ message: 'Get list of friend request successfully!', sent, received });
        } catch (error) {
            console.error('Error when get friend requests', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async getFriends(req, res, next) {
        try {
            const userId = req.user._id;
            const friendships = await Friend.find({
                $or: [
                    { userA: userId },
                    { userB: userId },
                ]
            })
            .populate("userA", "_id displayName avatarUrl")
            .populate("userB", "_id displayName avatarUrl")
            .lean();            

            if(!friendships.length){
                return res.status(200).json({ friends: [] });
            }

            const friends = friendships.map((user) => user.userA._id.toString() === userId.toString() ? user.userB : user.userA);

            return res.status(201).json({ message: 'Get list of friend successfully!', friends });
        } catch (error) {
            console.error('Error when get friend list', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

const friendController = new FriendController();
export default friendController;