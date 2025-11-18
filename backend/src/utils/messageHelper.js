export default function updateConversationAfterCreateMessage(conversation, senderId, message) {
    conversation.set({
        seenBy: [],
        lastMessageAt: message.createdAt,
        lastMessage: {
            _id: message._id,
            content: message.content,
            senderId,
            createdAt: message.createdAt
        }
    });

    conversation.participants.forEach((p) => {
        const memberId = p.userId.toString();
        const prevCount = conversation.unreadCount.get(memberId) || 0;
        conversation.unreadCount.set(memberId, memberId === senderId.toString() ? 0 : prevCount + 1);
    });
}