import { useMutation } from '@tanstack/react-query';
import { ai_api } from '@/lib/api';

export interface TranscribeSegment {
    id: number;
    start: number;
    end: number;
    text: string;
}

export interface TranscribeResponse {
    chunk_id: string;
    request_id: string;
    transcript: string;
    language_code: string;
    detected_lang: string | null;
    detected_lang_prob: number | null;
    segments: TranscribeSegment[];
    audio_duration_sec: number;
    processing_time_sec: number;
    realtime_factor: number;
    timestamp_utc: string;
    status: string;
    error: string | null;
}

export function useTranscribe() {
    return useMutation<TranscribeResponse, Error, FormData>({
        mutationFn: async (formData: FormData) => {
            console.log("calling api")
            const { data } = await ai_api.post('/transcribe/chunk', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return data;
        },
    });
}