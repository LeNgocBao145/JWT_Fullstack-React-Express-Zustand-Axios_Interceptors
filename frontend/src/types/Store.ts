import type { Conversation, ConversationResponse, Message } from "./Chat";
import type { User } from "./User"; 

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;

  clearState: () => void;

  setAccessToken: (newAccessToken: string) => void;

  signUp: (
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    password: string
  ) => Promise<void>;

  signIn: (
    userName: string,
    password: string
  ) => Promise<void>;

  signOut: () => Promise<void>;

  fetchMe: () => Promise<void>;

  refresh: () => Promise<void>;
};

export interface ThemeState{
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
};

export interface ChatStore{
  conversations: Conversation[];
  messages: Record<string, {
    items: Message[],
    hasMore: boolean; // infinite-scroll
    nextCursor?: string | null; // pagination
  }>;
  activeConversationId: string | null;
  conversationLoading: boolean;
  messageLoading: boolean;
  reset: () => void;

  setActiveConversationId: (id: string | null) => void;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId?: string) => Promise<void>;
};