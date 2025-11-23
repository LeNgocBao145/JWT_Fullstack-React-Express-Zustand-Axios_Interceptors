import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

class ConversationController {
  async createConversation(req, res, next) {
    try {
      const userId = req.user._id;
      const { type, name, memberIds } = req.body;

      if (
        !type ||
        (type === "group" && !name) ||
        !memberIds ||
        memberIds.length == 0 ||
        !Array.isArray(memberIds)
      ) {
        return res
          .status(400)
          .json({ message: "Group and member Ids are required!!" });
      }

      let conversation;

      if (type === "direct") {
        const participantId = memberIds[0];

        conversation = Conversation.findOne(
          { type: "direct" },
          {
            "participants.userId": { $all: [userId, participantId] },
          }
        );

        if (!conversation) {
          conversation = new Conversation({
            type: "direct",
            participants: [
              {
                userId,
              },
              {
                userId: participantId,
              },
            ],
            lastMessageAt: new Date(),
          });

          await conversation.save();
        }
      }

      if (type === "group") {
        conversation = await Conversation.create({
          type: "group",
          participants: [
            {
              userId,
            },
            ...memberIds.map((id) => ({
              userId: id,
            })),
          ],
          group: {
            name,
            createBy: userId,
          },
          lastMessageAt: new Date(),
        });
      }

      if (!conversation) {
        return res.status(403).json({
          message: "Conversation is not created because type is invalid!!",
        });
      }

      await conversation.populate([
        { path: "participants.userId", select: "displayName avatarUrl" },
        { path: "seenBy", select: "displayName avatarUrl" },
        { path: "lastMessage.senderId", select: "displayName avatarUrl" },
      ]);

      return res
        .status(201)
        .json({ message: "Create conversation successfully!!", conversation });
    } catch (error) {
      console.error("Error when create conversation!!", error);
      return res.status(500).json({ message: "Internal server error!!" });
    }
  }
  async getConversations(req, res, next) {
    try {
      const userId = req.user._id;
      const conversations = await Conversation.find({
        "participants.userId": userId,
      })
        .sort({ lastMessageAt: -1, updatedAt: -1 })
        .populate({
          path: "participants.userId",
          select: "displayName avatarUrl",
        })
        .populate({ path: "seenBy", select: "displayName avatarUrl" })
        .populate({
          path: "lastMessage.senderId",
          select: "displayName avatarUrl",
        });

      if (!conversations) {
        return res
          .status(404)
          .json({ message: "Conversation is not existed!!" });
      }

      const formatted = conversations.map((conversation) => {
        const participants = (conversation.participants || []).map((p) => {
          return {
            _id: p.userId?._id,
            displayName: p.userId?.displayName,
            avatarUrl: p.userId?.avatarUrl ?? null,
            joinedAt: p.joinedAt,
          };
        });

        return {
          // Use toObject here to prevent uneccessary metadata information from Mongoose document
          ...conversation.toObject(),
          unreadCounts: conversation.unreadCount || {},
          participants,
        };
      });

      return res
        .status(201)
        .json({
          message: "Get conversation successfully!!",
          conversations: formatted,
        });
    } catch (error) {
      console.error("Error when get conversations!!", error);
      return res.status(500).json({ message: "Internal server error!!" });
    }
  }
  async getMessages(req, res, next) {
    try {
      const { conversationId } = req.params;
      const { limit = 50, cursor } = req.query;

      if (!conversationId) {
        return res
          .status(403)
          .json({ message: "Conversation Id is required!!" });
      }

      const query = { conversationId };

      if (cursor) {
        query.createdAt = { $lt: new Date(cursor) };
      }

      const conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        return res
          .status(404)
          .json({ message: "Conversation is not existed!!" });
      }

      let messages = await Message.find(query)
        .sort({ createdAt: -1 })
        .limit(Number(limit) + 1);

      let nextCursor = null;

      if (messages.length > Number(limit)) {
        const nextMessage = messages[messages.length - 1];
        // Use toISOString() for a consistent UTC string format instead of toString(),
        // which is locale-dependent and not safe for storage or API responses.
        // Example:
        // const now = new Date();
        // now.toString()      => "Wed Nov 20 2025 10:42:00 GMT+0700 (Indochina Time)"
        // now.toISOString()   => "2025-11-20T03:42:00.000Z" (UTC, standard, safe for DB/API)
        nextCursor = nextMessage.createdAt.toISOString();
        messages.pop();
      }

      // if(messages.length == 0){
      //     return res.status(404).json({ message: "Conversation is not existed!!" });
      // }

      messages = messages.reverse();

      return res
        .status(201)
        .json({ message: "Get messages successfully!!", messages, nextCursor });
    } catch (error) {
      console.error("Error when get messages!!", error);
      return res.status(500).json({ message: "Internal server error!!" });
    }
  }
}

const conversationController = new ConversationController();

export default conversationController;
