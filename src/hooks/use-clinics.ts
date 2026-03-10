'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { API_ENDPOINTS, QUERY_KEYS } from '@/lib/constants/api-endpoints';
import { Clinic, PaginatedResponse } from '@/lib/types';

export interface ClinicStats {
    doctors: number;
    receptionists: number;
    appointmentsToday: number;
    patientsSeen: number;
}

export interface CreateClinicDto {
    name: string;
    address: string;
    phone: string;
    email: string;
    isActive?: boolean;
}

export type UpdateClinicDto = Partial<CreateClinicDto>;

export interface ClinicParams {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
}

export function useClinics(params?: ClinicParams) {
    return useQuery<PaginatedResponse<Clinic>>({
        queryKey: [...QUERY_KEYS.CLINICS, params],
        queryFn: async () => {
            const { data } = await api.get(API_ENDPOINTS.CLINICS.BASE, { params });
            return data;
        },
    });
}

export function useClinicStats(clinicId?: string) {
    return useQuery<ClinicStats>({
        queryKey: [...QUERY_KEYS.CLINICS, clinicId, 'stats'],
        queryFn: async () => {
            const { data } = await api.get(API_ENDPOINTS.CLINICS.STATS(clinicId!));
            return data;
        },
        enabled: !!clinicId,
    });
}

export function useCreateClinic() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateClinicDto) => {
            const { data } = await api.post(API_ENDPOINTS.CLINICS.BASE, payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CLINICS });
        },
    });
}

export function useUpdateClinic() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, payload }: { id: string; payload: UpdateClinicDto }) => {
            const { data } = await api.patch(API_ENDPOINTS.CLINICS.ONE(id), payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CLINICS });
        },
    });
}

export function useDeactivateClinic() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.delete(API_ENDPOINTS.CLINICS.ONE(id));
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CLINICS });
        },
    });
}

export function useDeleteClinic() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.delete(API_ENDPOINTS.CLINICS.PERMANENT(id));
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CLINICS });
        },
    });
}
