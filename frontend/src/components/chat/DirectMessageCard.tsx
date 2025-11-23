import type { Conversation } from "@/types/Chat";
import ChatCard from "./ChatCard";
import useChatStore from "@/stores/chatStore";
import useAuthStore from "@/stores/authStore";
import { cn } from "@/lib/utils";
import UserAvatar from "./UserAvatar";
import StatusBadge from "./StatusBadge";
import UnreadCountBadge from "./UnreadCountBadge";

const DirectMessageCard = ({
  conversation,
}: {
  conversation: Conversation;
}) => {
  const { user } = useAuthStore();
  const { messages, activeConversationId, setActiveConversationId } =
    useChatStore();

  if (!user) return null;

  const otherUser = conversation.participants.find(
    (u) => u._id.toString() !== user._id.toString()
  );

  if (!otherUser) return null;

  const unreadCount = conversation.unreadCounts[user._id] ?? 0;
  const lastMessage = conversation.lastMessage?.content ?? "";

  const handleSelectConversation = async (id: string) => {
    setActiveConversationId(id);
    if (!messages[id]) {
    }
  };

  return (
    <div>
      <ChatCard
        conversationId={conversation._id}
        name={otherUser.displayName ?? ""}
        timestamp={
          conversation.lastMessage?.createdAt
            ? new Date(conversation.lastMessage?.createdAt)
            : undefined
        }
        isActive={activeConversationId === conversation._id}
        onSelect={handleSelectConversation}
        unreadCount={unreadCount}
        leftSection={
          <>
            <UserAvatar
              type="sidebar"
              name={otherUser.displayName ?? ""}
              avatarUrl={otherUser.avatarUrl ?? undefined}
            />
            <StatusBadge status="offline" />
            {unreadCount > 0 && <UnreadCountBadge unreadCount={unreadCount} />}
          </>
        }
        subtitle={
          <p
            className={cn(
              "text-sm truncate",
              unreadCount > 0
                ? "font-medium text-foreground"
                : "text-muted-foreground"
            )}
          >
            {lastMessage}
          </p>
        }
      />
    </div>
  );
};

export default DirectMessageCard;
