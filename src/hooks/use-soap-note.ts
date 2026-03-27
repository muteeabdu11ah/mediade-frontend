// hooks/use-soap-note.ts
import { useMutation } from '@tanstack/react-query';
import { ai_api } from '@/lib/api';

export interface SoapNoteResponse {
    summary: string;
    diagnosis: string[];
    plan: {
        medication_adjustment: string;
        further_tests: string;
        lifestyle_modifications: string;
        follow_up: string;
    };
    suggested_medications: string[];
}

export function useGenerateSoapNote() {
    return useMutation<SoapNoteResponse, Error, { transcript: string }>({
        mutationFn: async (payload) => {
            const { data } = await ai_api.post('/generate-soap-note', payload);
            return data;
        },
    });
}