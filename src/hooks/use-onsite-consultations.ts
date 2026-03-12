import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { API_ENDPOINTS, QUERY_KEYS } from '@/lib/constants/api-endpoints';

export interface OnsiteParams {
    page?: number;
    limit?: number;
    date?: string;
    dateFilter?: string;
}

export function useOnsiteConsultations(params: OnsiteParams) {
    return useQuery({
        queryKey: [...QUERY_KEYS.ONSITE_CONSULTATIONS, params],
        queryFn: async () => {
            const { data } = await api.get(API_ENDPOINTS.APPOINTMENTS.ONSITE, { params });
            return data;
        },
    });
}

export function useDoctorOnsiteStats(params: { startDate: string; endDate: string }) {
    return useQuery<Record<string, number>>({
        queryKey: [...QUERY_KEYS.ONSITE_CONSULTATIONS, 'stats', params],
        queryFn: async () => {
            const { data } = await api.get(API_ENDPOINTS.APPOINTMENTS.ONSITE_STATS, { params });
            return data;
        },
    });
}

export function useCreateOnsiteConsultation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: any) => {
            const { data } = await api.post(API_ENDPOINTS.APPOINTMENTS.ONSITE_CREATE, payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ONSITE_CONSULTATIONS });
        },
    });
}
