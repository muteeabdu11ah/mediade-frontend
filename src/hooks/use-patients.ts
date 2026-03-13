import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { QUERY_KEYS } from '@/lib/constants/api-endpoints';
import { PatientProfile } from '@/lib/types';

export function usePatientProfile() {
    return useQuery<PatientProfile>({
        queryKey: QUERY_KEYS.PATIENT_PROFILE,
        queryFn: async () => {
            const { data } = await api.get('/patients/profile');
            return data;
        },
    });
}

export function useUpdatePatientProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: Partial<PatientProfile>) => {
            const { data } = await api.patch('/patients/profile', payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PATIENT_PROFILE });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_ME });
        },
    });
}
