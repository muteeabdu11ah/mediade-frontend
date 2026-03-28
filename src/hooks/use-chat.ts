import { useMutation } from '@tanstack/react-query';
import { ai_api } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants/api-endpoints';
import { ChatResponse } from '@/lib/types';

export interface ChatParams {
    user_input: string;
}

export function useChat() {
    return useMutation<ChatResponse, Error, ChatParams>({
        mutationFn: async (params: ChatParams) => {
            const { data } = await ai_api.post("https://5dc3-2407-d000-1a-e92e-e530-9096-144a-a7fa.ngrok-free.app/chat", params);
            return data;
        },
    });
}