import {create} from 'zustand';
import type {ChatStore} from '@/types/Store'
import { persist } from 'zustand/middleware';
import chatService from '@/services/chatService';

const useChatStore = create<ChatStore>()(
    persist(
        (set, get) => ({
            conversations: [],
            messages: {},
            activeConversationId: null,
            loading: false,
            reset: () => {
                set({
                    conversations: [],
                    messages: {},
                    activeConversationId: null,
                    loading: false,
                });
            },
        
            setActiveConversationId: (id: string | null) => {
                set({activeConversationId: id});
            },
            fetchConversations: async () => {
                try {
                    set({loading: true});
                    const {conversations} = await chatService.fetchConversations();
                    set({conversations});
                } catch (error) {
                    console.error("Error when fetch conversations!!", error);
                } finally {
                    set({loading: false});
                }
            },
        }),{
            name: "chat-storage",
            // Local storage has limit 
            // We don't save messages in local storage to prevent hacker read messages
            partialize: (state) => ({conversations: state.conversations}),
        }
    )
);

export default useChatStore;