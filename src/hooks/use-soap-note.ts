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
    return useMutation<SoapNoteResponse, Error, string>({
        mutationFn: async (transcript: string) => {
            const { data } = await ai_api.post('/generate-soap-note', transcript, {
                headers: {
                    'Content-Type': 'text/plain',
                    'Accept': 'application/json',
                },
            });
            return data;
        },
    });
}