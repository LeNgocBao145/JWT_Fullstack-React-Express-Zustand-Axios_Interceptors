import type { Conversation } from "@/types/Chat";
import ChatCard from "./ChatCard";
import useAuthStore from "@/stores/authStore";
import useChatStore from "@/stores/chatStore";

const GroupMessageCard = ({ conversation }: { conversation: Conversation }) => {
  const { user } = useAuthStore();
  const { messages, activeConversationId, setActiveConversationId } =
    useChatStore();

  if (!user) return null;
  
  const unreadCount = conversation.unreadCounts[user._id] ?? 0;
  const handleSelectConversation = async (id: string) => {
    setActiveConversationId(id);
    if (!messages[id]) {
    }
  };

  return (
    <div>
      <ChatCard
        conversationId={conversation._id}
        name={conversation.group?.name ?? ""}
        timestamp={
          conversation.lastMessage?.createdAt
            ? new Date(conversation.lastMessage?.createdAt)
            : undefined
        }
        isActive={conversation._id === activeConversationId}
        onSelect={handleSelectConversation}
        unreadCount={unreadCount}
        leftSection={
          <></>
        }
        subtitle={
          <p className="text-sm truncate text-muted-foreground">
            {conversation.participants.length} members
          </p>
        }
      />
    </div>
  );
};

export default GroupMessageCard;
