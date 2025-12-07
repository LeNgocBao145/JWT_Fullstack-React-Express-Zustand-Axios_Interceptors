import {create} from 'zustand';
import type {ChatStore} from '@/types/Store'
import { persist } from 'zustand/middleware';
import chatService from '@/services/chatService';
import useAuthStore from './authStore';

const useChatStore = create<ChatStore>()(
    persist(
        (set, get) => ({
            conversations: [],
            messages: {},
            activeConversationId: null,
            conversationLoading: false,
            messageLoading: false,
            reset: () => {
                set({
                    conversations: [],
                    messages: {},
                    activeConversationId: null,
                    conversationLoading: false,
                    messageLoading: false,
                });
            },
        
            setActiveConversationId: (id: string | null) => {
                set({activeConversationId: id});
            },
            fetchConversations: async () => {
                try {
                    set({conversationLoading: true});
                    const {conversations} = await chatService.fetchConversations();
                    set({conversations});
                } catch (error) {
                    console.error("Error when fetch conversations!!", error);
                } finally {
                    set({conversationLoading: false});
                }
            },
            fetchMessages: async (conversationId) => {
                const {activeConversationId, messages} = get();
                const {user} = useAuthStore.getState();
                
                const converId = conversationId ?? activeConversationId;
                
                if(!converId) return;
                
                const current = messages?.[converId];
                const nextCursor = current?.nextCursor === undefined ? "" : current?.nextCursor;
                
                if(nextCursor === null) return;

                set({messageLoading: true});
                try {                    
                    const {messages: fetchedMessages, cursor} = await chatService.fetchMessages(converId, nextCursor);
                    const proccessedMessages = fetchedMessages.map((message) => {
                        return {
                            ...message,
                            isOwn: message.senderId === user?._id
                        }
                    });
                    set((state) => {
                        const prevMessages = messages?.[converId]?.items ?? [];
                        const mergedMessages = prevMessages.length > 0 ? [...prevMessages, ...proccessedMessages] : proccessedMessages;
                        return {
                            messages: {
                                ...state.messages,
                                [converId]: {
                                    items: mergedMessages,
                                    hasMore: !!cursor,
                                    nextCursor: cursor ?? null,
                                }
                            }
                        }
                    })
                } catch (error) {
                    console.error("Error when fetch messages!!", error);
                } finally {
                    set({messageLoading: false});
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