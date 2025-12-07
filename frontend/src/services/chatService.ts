import api from "@/lib/axios";
import type { ConversationResponse, Message } from "@/types/Chat";

interface FetchMessageProps{
    messages: Message[];
    cursor?: string;
}

const limit = 50;

const chatService = {
    fetchConversations: async (): Promise<ConversationResponse> => {
        try {
            const res = await api.get('/conversations');
            return res.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    fetchMessages: async (id: string, cursor?: string): Promise<FetchMessageProps> => {
        try {
            const res = await api.get(`/conversations/${id}/messages?limit=${limit}&cursor=${cursor}`);
            return {messages: res.data.messages, cursor: res.data.nextCursor};
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
}

export default chatService;