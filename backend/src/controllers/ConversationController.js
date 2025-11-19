import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

class ConversationController {
    async createConversation(req, res, next){
        try {
            const userId = req.user._id;
            const {groupName} = req.body;



            const conversation = await Conversation.create({
                type: 'group',
                participants: [{
                    userId,
                    joinedAt: new Date(),
                }],
                group: {
                    name: groupName,
                    createBy: userId,
                },                
            });

            if(!conversation){
                return res.status(403).json({ message: "Conversation is not created!!" });
            }

            return res.status(201).json({ message: "Create conversation successfully!!", conversation });
        } catch (error) {
            console.error("Error when create conversation!!", error);
            return res.status(500).json({ message: "Internal server error!!" });
        }
    }
    async getConversations(req, res, next){
        try {
            const {conversationId} = req.body;

            if(!conversationId){
                return res.status(403).json({ message: "Conversation Id is required!!" });
            }

            const conversation = await Conversation.findById(conversationId);

            if(!conversation){
                return res.status(404).json({ message: "Conversation is not existed!!" });
            }

            return res.status(201).json({ message: "Get conversation successfully!!", conversation });
        } catch (error) {
            console.error("Error when get conversations!!", error);
            return res.status(500).json({ message: "Internal server error!!" });
        }
    }
    async getMessages(req, res, next){
        try {
            const {conversationId} = req.params;

            if(!conversationId){
                return res.status(403).json({ message: "Conversation Id is required!!" });
            }

            const conversation = await Conversation.findById(conversationId);

            if(!conversation){
                return res.status(404).json({ message: "Conversation is not existed!!" });
            }

            const messages = Message.find({ conversationId });

            // if(messages.length == 0){
            //     return res.status(404).json({ message: "Conversation is not existed!!" });
            // }

            return res.status(201).json({ message: "Get messages successfully!!", messages });
        } catch (error) {
            console.error("Error when get messages!!", error);
            return res.status(500).json({ message: "Internal server error!!" });
        }
    }
}

const conversationController = new ConversationController();

export default conversationController;