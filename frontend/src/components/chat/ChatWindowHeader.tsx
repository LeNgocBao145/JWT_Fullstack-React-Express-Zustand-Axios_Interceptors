import type { Conversation } from "@/types/Chat";
import { SidebarTrigger } from "../ui/sidebar";
import useChatStore from "@/stores/chatStore";
import { Separator } from "@radix-ui/react-separator";
import useAuthStore from "@/stores/authStore";
import UserAvatar from "./UserAvatar";
import StatusBadge from "./StatusBadge";
import GroupChatAvatar from "./GroupChatAvatar";

const ChatWindowHeader = ({ chat }: { chat?: Conversation }) => {
  const { conversations, activeConversationId } = useChatStore();
  const { user } = useAuthStore();
  let otherUser;

  chat = chat ?? conversations.find((c) => c._id === activeConversationId);

  if (!chat) {
    return (
      <header className="md:hidden sticky top-0 z-10 flex items-center w-full gap-2 px-4 py-2">
        <SidebarTrigger className="-ml-1 text-foreground" />
      </header>
    );
  }

  if (chat.type === "direct") {
    otherUser = chat.participants.find((u) => u._id !== user?._id);

    if (!user || !otherUser) return;
  }

  return (
    <header className="sticky top-0 z-10 -ml-1 px-4 py-2 flex items-center bg-background">
      <div className="flex items-center gap-2 w-full">
        <SidebarTrigger className="-ml-1 text-foreground" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4 data-[orientation=vertical]:w-px data-[orientation=vertical]:bg-border"
        />
        <div className="p-2 w-full flex items-center gap-3">
          <div className="relative">
            {chat.type === "direct" ? (
              <>
                <UserAvatar
                  type={"sidebar"}
                  name={otherUser?.displayName || ""}
                  avatarUrl={otherUser?.avatarUrl || undefined}
                  className="relative"
                />
                <StatusBadge status="offline" />
              </>
            ) : (
              <>
                <GroupChatAvatar
                  participants={chat.participants}
                  type={"sidebar"}
                />
              </>
            )}
          </div>
          <h2 className="font-semibold text-foreground">
            {chat.type === "direct" ? otherUser?.displayName : chat.group?.name}
          </h2>
        </div>
      </div>
    </header>
  );
};
export default ChatWindowHeader;
