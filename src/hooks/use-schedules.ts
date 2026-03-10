import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { API_ENDPOINTS, QUERY_KEYS } from '@/lib/constants/api-endpoints';
import { DoctorSchedule, DayOfWeek } from '@/lib/types';

export interface ScheduleFormData {
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
}

export const useSchedules = () => {
    const queryClient = useQueryClient();

    const fetchSchedules = async (): Promise<DoctorSchedule[]> => {
        const res = await api.get<DoctorSchedule[]>(API_ENDPOINTS.SCHEDULES.ME);
        return res.data;
    };

    const schedulesQuery = useQuery({
        queryKey: QUERY_KEYS.DOCTOR_SCHEDULES,
        queryFn: fetchSchedules,
    });

    const updateSchedulesMutation = useMutation({
        mutationFn: async (payload: { schedules: ScheduleFormData[] }) => {
            await api.post(API_ENDPOINTS.SCHEDULES.ME, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOCTOR_SCHEDULES });
        },
    });

    return {
        schedules: schedulesQuery.data,
        isLoading: schedulesQuery.isLoading,
        error: schedulesQuery.error,
        updateSchedules: updateSchedulesMutation.mutateAsync,
        isSaving: updateSchedulesMutation.isPending,
        mutationError: updateSchedulesMutation.error,
    };
};
