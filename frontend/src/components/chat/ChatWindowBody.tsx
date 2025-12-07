import useAuthStore from "@/stores/authStore";
import useChatStore from "@/stores/chatStore";
import ChatWelcomeScreen from "./ChatWelcomeScreen";
import MessageItem from "./MessageItem";

const ChatWindowBody = () => {
  const {
    activeConversationId,
    conversations,
    messages: allMessages,
  } = useChatStore();
  const { user } = useAuthStore();

  // activeConversationId!  → Non-null assertion: we guarantee this value is not null/undefined.
  const messages = allMessages[activeConversationId!]?.items ?? [];
  const selectedConver = conversations.find(
    (c) => c._id === activeConversationId
  );
  if (!selectedConver) {
    return <ChatWelcomeScreen />;
  }

  if (!messages || messages.length <= 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        There are no messages in this conversation
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 bg-primary-foreground overflow-hidden">
      <div className="flex flex-col overflow-y-auto overflow-x-hidden beautiful-scrollbar">
        {messages.map((message, index) => (
          <MessageItem
            key={message._id ?? index}
            messages={messages}
            index={index}
            message={message}
            selectedConver={selectedConver}
            lastMessageStatus={"delivered"}
          />
        ))}
      </div>
    </div>
  );
};
export default ChatWindowBody;
