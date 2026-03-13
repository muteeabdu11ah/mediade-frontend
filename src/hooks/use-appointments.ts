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

export function useDoctorAppointmentStats(params: { startDate: string; endDate: string }) {
    return useQuery<Record<string, number>>({
        queryKey: [...QUERY_KEYS.APPOINTMENTS, 'doctor-stats', params],
        queryFn: async () => {
            const { data } = await api.get(API_ENDPOINTS.APPOINTMENTS.DOCTOR_STATS, { params });
            return data;
        },
    });
}

export interface DoctorStatsCards {
    today: number;
    upcoming: number;
    completed: number;
}

export function useDoctorStatsCards() {
    return useQuery<DoctorStatsCards>({
        queryKey: QUERY_KEYS.DOCTOR_STATS_CARDS,
        queryFn: async () => {
            const { data } = await api.get(API_ENDPOINTS.APPOINTMENTS.DOCTOR_STATS_CARDS);
            return data;
        },
    });
}

export function useDoctorDurationChart() {
    return useQuery<{ name: string; value: number }[]>({
        queryKey: QUERY_KEYS.DOCTOR_DURATION_CHART,
        queryFn: async () => {
            const { data } = await api.get(API_ENDPOINTS.APPOINTMENTS.DOCTOR_DURATION_CHART);
            return data;
        },
    });
}

export function useDoctorConsultationsChart(
    timeframe: 'week' | 'month' | '6months' | 'year' | 'custom' = '6months',
    startDate?: string,
    endDate?: string
) {
    return useQuery<{ name: string; value: number }[]>({
        queryKey: [...QUERY_KEYS.DOCTOR_CONSULTATIONS_CHART, timeframe, startDate, endDate],
        queryFn: async () => {
            const { data } = await api.get(API_ENDPOINTS.APPOINTMENTS.DOCTOR_CONSULTATIONS_CHART, {
                params: { timeframe, startDate, endDate }
            });
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
    specialty?: string;
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

export function usePatientAppointmentStats(params: { startDate: string; endDate: string }) {
    return useQuery<Record<string, number>>({
        queryKey: [...QUERY_KEYS.APPOINTMENTS, 'patient-stats', params],
        queryFn: async () => {
            const { data } = await api.get(API_ENDPOINTS.APPOINTMENTS.PATIENT_STATS, { params });
            return data;
        },
    });
}

export interface PatientStatsCards {
    today: number;
    upcoming: number;
    missed: number;
}

export function usePatientStatsCards() {
    return useQuery<PatientStatsCards>({
        queryKey: QUERY_KEYS.PATIENT_STATS_CARDS,
        queryFn: async () => {
            const { data } = await api.get(API_ENDPOINTS.APPOINTMENTS.PATIENT_STATS_CARDS);
            return data;
        },
    });
}

export interface PatientUpcomingAppointment {
    id: string;
    doctorName: string;
    specialty: string;
    profileImageUrl: string | null;
    date: string;
    isToday: boolean;
    startTime: string;
}

export function usePatientUpcomingList(limit: number = 5) {
    return useQuery<PatientUpcomingAppointment[]>({
        queryKey: [...QUERY_KEYS.PATIENT_UPCOMING_LIST, limit],
        queryFn: async () => {
            const { data } = await api.get(API_ENDPOINTS.APPOINTMENTS.PATIENT_UPCOMING_LIST, {
                params: { limit },
            });
            return data;
        },
    });
}

export function usePatientTotalChart(
    timeframe: 'week' | 'month' | '6months' | 'year' | 'custom' = '6months',
    startDate?: string,
    endDate?: string
) {
    return useQuery<{ name: string; value: number }[]>({
        queryKey: [...QUERY_KEYS.PATIENT_TOTAL_CHART, timeframe, startDate, endDate],
        queryFn: async () => {
            const { data } = await api.get(API_ENDPOINTS.APPOINTMENTS.PATIENT_TOTAL_CHART, {
                params: { timeframe, startDate, endDate }
            });
            return data;
        },
    });
}

export interface ClinicAppointmentsParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
}

export function useClinicAppointments(params?: ClinicAppointmentsParams) {
    return useQuery<PaginatedResponse<Appointment>>({
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
        mutationFn: async ({ id, status, reason }: { id: string; status: AppointmentStatus; reason?: string }) => {
            const { data } = await api.patch(API_ENDPOINTS.APPOINTMENTS.UPDATE_STATUS(id), { status, reason });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.APPOINTMENTS });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CLINIC_APPOINTMENTS });
        },
    });
}
