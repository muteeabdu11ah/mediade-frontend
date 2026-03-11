import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { API_ENDPOINTS, QUERY_KEYS } from '@/lib/constants/api-endpoints';
import { Appointment, AppointmentStatus, PaginatedResponse } from '@/lib/types';

export interface AppointmentsParams {
    page?: number;
    limit?: number;
    date?: string;
    type?: string;
}

export function useAppointments(params: AppointmentsParams) {
    return useQuery<PaginatedResponse<Appointment>>({
        queryKey: [...QUERY_KEYS.APPOINTMENTS, params],
        queryFn: async () => {
            const { data } = await api.get(API_ENDPOINTS.APPOINTMENTS.DOCTOR_ME, { params });
            return data;
        },
    });
}

export interface PatientAppointmentsParams {
    isHistory?: boolean;
    page?: number;
    limit?: number;
    search?: string;
    startDate?: string;
    endDate?: string;
}

export function usePatientAppointments(params?: PatientAppointmentsParams) {
    return useQuery<PaginatedResponse<Appointment>>({
        queryKey: [...QUERY_KEYS.APPOINTMENTS, 'patient', params],
        queryFn: async () => {
            const { data } = await api.get(API_ENDPOINTS.APPOINTMENTS.PATIENT_ME, { params });
            return data;
        },
    });
}

export interface ClinicAppointmentsParams {
    date?: string;
}

export function useClinicAppointments(params?: ClinicAppointmentsParams) {
    return useQuery<Appointment[]>({
        queryKey: [...QUERY_KEYS.CLINIC_APPOINTMENTS, params],
        queryFn: async () => {
            const { data } = await api.get(API_ENDPOINTS.APPOINTMENTS.CLINIC, { params });
            return data;
        },
    });
}

export function useUpdateAppointmentStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: AppointmentStatus }) => {
            const { data } = await api.patch(API_ENDPOINTS.APPOINTMENTS.UPDATE_STATUS(id), { status });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.APPOINTMENTS });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CLINIC_APPOINTMENTS });
        },
    });
}
