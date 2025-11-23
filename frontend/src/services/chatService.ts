import api from "@/lib/axios";
import type { ConversationResponse, Message } from "@/types/Chat";

const chatService = {
    fetchConversations: async (): Promise<ConversationResponse> => {
        try {
            const res = await api.get('/conversations');
            return res.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    } 
}

export default chatService;