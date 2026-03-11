'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { API_ENDPOINTS, QUERY_KEYS } from '@/lib/constants/api-endpoints';
import { Role, User, PaginatedResponse, Specialty, Language } from '@/lib/types';

export interface CreateUserDto {
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
    clinicId?: string;
    phone?: string;
    isActive?: boolean;
    specialty?: Specialty;
    yearsOfExperience?: number;
    languages?: Language[];
}

export type UpdateUserDto = Partial<CreateUserDto>;

export interface UserParams {
    page?: number;
    limit?: number;
    search?: string;
    role?: Role;
    clinicId?: string;
    isActive?: boolean;
}

export function useUsers(params?: UserParams) {
    return useQuery<PaginatedResponse<User>>({
        queryKey: [...QUERY_KEYS.USERS, params],
        queryFn: async () => {
            const { data } = await api.get(API_ENDPOINTS.USERS.BASE, {
                params,
            });
            return data;
        },
    });
}

export function useCreateClinicAdmin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateUserDto) => {
            const { data } = await api.post(API_ENDPOINTS.USERS.CLINIC_ADMIN, payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
        },
    });
}

export function useCreateDoctor() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateUserDto) => {
            const { data } = await api.post(API_ENDPOINTS.USERS.DOCTOR, payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
        },
    });
}

export function useCreateReceptionist() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateUserDto) => {
            const { data } = await api.post(API_ENDPOINTS.USERS.RECEPTIONIST, payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
        },
    });
}

export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, payload }: { id: string; payload: UpdateUserDto }) => {
            const { data } = await api.patch(`${API_ENDPOINTS.USERS.BASE}/${id}`, payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
        },
    });
}

export function useDeactivateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.delete(`${API_ENDPOINTS.USERS.BASE}/${id}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
        },
    });
}

export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.delete(`${API_ENDPOINTS.USERS.BASE}/${id}/permanent`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
        },
    });
}
