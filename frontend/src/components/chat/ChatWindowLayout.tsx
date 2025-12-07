import useChatStore from "@/stores/chatStore";
import ChatWelcomeScreen from "./ChatWelcomeScreen";
import ChatWindowSkeleton from "./ChatWindowSkeleton";
import ChatWindowHeader from "./ChatWindowHeader";

import { Sidebar } from "lucide-react";
import { SidebarInset } from "../ui/sidebar";
import ChatWindowBody from "./ChatWindowBody";
import MessageInput from "./MessageInput";

const ChatWindowLayout = () => {
  const { activeConversationId, messageLoading: loading, messages, conversations } = useChatStore();

  const selectedConver = conversations.find((c) => c._id === activeConversationId);

  if(!selectedConver) return <ChatWelcomeScreen/>;

  if (loading){
    return <ChatWindowSkeleton/>;
  }

  return (
    <SidebarInset className="flex flex-col h-full flex-1 overflow-hidden rounded-sm shadow-md">
      {/* Header */}
      <ChatWindowHeader/>
      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-primary-foreground">
        <ChatWindowBody/>
      </div>
      {/* Footer */}
      <MessageInput/>
    </SidebarInset>
  );
};

export default ChatWindowLayout;
