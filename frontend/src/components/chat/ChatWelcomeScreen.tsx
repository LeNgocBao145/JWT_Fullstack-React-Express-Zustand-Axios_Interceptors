import { SidebarInset } from "../ui/sidebar";
import ChatWindowHeader from "./ChatWindowHeader";

const ChatWelcomeScreen = () => {
  return (
    <SidebarInset className="flex w-full h-full bg-transparent">
      <ChatWindowHeader />
      <div className="flex flex-1 bg-primary-foreground rounded-2xl justify-center items-center">
        <div className="text-center">
          <div className="size-24 mx-auto mb-6 bg-gradient-chat shadow-glow flex rounded-full pulse-ring justify-center items-center">
            <span className="text-3xl">💬</span>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-chat mb-2 text-transparent bg-clip-text">Welcome to Moji!</h2>
          <p className="text-muted-foreground">
            Choose conversation to start a chat
          </p>
        </div>
      </div>
    </SidebarInset>
  );
};

export default ChatWelcomeScreen;
