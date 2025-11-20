import Conversation from "../models/Conversation.js";
import Friend from "../models/Friend.js";

const pair = (a, b) => (a < b ? [a, b] : [b, a]);

export const checkFriendship = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const recipientId = req.body?.recipientId ?? null;
    const memberIds = req.body?.memberIds ?? [];

    if (!recipientId && memberIds.length === 0) {
      return res
        .status(403)
        .json({ message: "Recipient Id or Member Ids are required!!" });
    }

    if (recipientId) {
      const [userA, userB] = pair(userId, recipientId);

      // Do NOT use Friend.find() here because find() always returns an array ([] or [...]).
      // An empty array is still truthy, causing `if (!isFriend)` to fail and the middleware
      // will incorrectly allow the request even when the users are NOT friends.
      // Use findOne() instead — it returns `null` when no document is found, which makes the
      // friend check work correctly.
      const isFriend = await Friend.findOne({ userA, userB });
      if (!isFriend) {
        return res
          .status(403)
          .json({ message: "You are not friends with this user!!" });
      }

      return next();
    }

    const friendChecks = memberIds.map(async (memberId) => {
      const [userA, userB] = pair(userId, memberId);
      const friend = await Friend.findOne({ userA, userB });
      return friend ? null : memberId;
    });

    const results = await Promise.all(friendChecks);
    const notFriends = results.filter(Boolean);

    if (notFriends.length > 0) {
      return res
        .status(403)
        .json({
          message: "You can not add people who are not friends into group!!",
          notFriends,
        });
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error!!" });
  }
};

export const checkGroupMembership = async (req, res, next)  => {
  try {
    const {conversationId} = req.body;
    const userId = req.user._id;

    if(!conversationId) {
      return res.status(403).json({message: "Conversation Id is required!!"});
    }

    const conversation = await Conversation.findById(conversationId);
    if(!conversation) {
      return res.status(404).json({message: "Conversation is not existed!!"});
    }

    const isMember = conversation.participants.some((p) => 
      p.userId.toString() === userId.toString()
    );

    if(!isMember) {
      return res.status(403).json({ message: "You are not member of this group" });
    }

    req.conversation = conversation;

    next();
  } catch (error) {
    console.error("Error when check group membership!!", error);
    return res.status(500).json({ message: "Internal server error!!" });
  }
}