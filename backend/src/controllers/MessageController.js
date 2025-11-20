import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import User from '../models/User.js';
import updateConversationAfterCreateMessage from '../utils/messageHelper.js'

class MessageController {
    async sendDirectMessage(req, res, next){
        try {
            const {recipientId, content, conversationId} = req.body;
            const senderId = req.user._id;

            if(!content){
                return res.status(400).json({ message: "Message is empty!!" });
            }

            const user = await User.findById(recipientId);

            if(!user){
                return res.status(404).json({ message: "The user that you sent message to is not existed!!" });            
            }

            let conversation;

            if(conversationId){
                conversation = await Conversation.findById(conversationId);
            }

            if(!conversationId){
                conversation = await Conversation.create({
                    type: 'direct',
                    participants: [
                        { userId: senderId, joinedAt: new Date() },
                        { userId: recipientId, joinedAt: new Date() }
                    ], 
                    lastMessageAt: new Date(),
                    unreadCount: new Map(),                               
                });
            }            

            const message = await Message.create({
                conversationId: conversation._id,
                senderId,
                content,
            });

            if(!message){
                return res.status(403).json({ message: "Error when create message!!" });                
            }

            updateConversationAfterCreateMessage(conversation, senderId, message);

            await conversation.save();

            return res.status(200).json({ message: "Send direct message successfully!!", data: message });
        } catch (error) {
            console.error("Error when send direct message!", error);
            return res.status(500).json({ message: "Internal server error!!" });
        }
    }
    async sendGroupMessage(req, res, next){
        try {
            const {conversationId, content} = req.body;
            const userId = req.user._id;

            const conversation = req.conversation;

            if(!content){
                return res.status(400).json({ message: "Message is empty!!" });
            }

            const message = await Message.create({
                conversationId,
                senderId: userId,
                content,
            });

            if(!message){
                return res.status(403).json({ message: "Error when create message!!" });                
            }

            updateConversationAfterCreateMessage(conversation, userId, message);

            await conversation.save();

            return res.status(200).json({ message: "Send direct message successfully!!", message });
        } catch (error) {
            console.error("Error when send group message!");
            return res.status(500).json({ message: "Internal server error!!" });
        }
    }
}

const messageController = new MessageController();
export default messageController;