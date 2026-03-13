import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { QUERY_KEYS } from '@/lib/constants/api-endpoints';

export function useUpdateProfileImage() {
    return useMutation({
        mutationFn: async (file: File) => {
            const data = new FormData();
            data.append('file', file);

            const res = await api.post('/auth/profile-image', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return res.data;
        },
    });
}

export function useUpdateProfile() {
    return useMutation({
        mutationFn: async (payload: any) => {
            const res = await api.patch('/auth/profile', payload);
            return res.data;
        },
    });
}

export function useChangePassword() {
    return useMutation({
        mutationFn: async (payload: any) => {
            const res = await api.patch('/auth/change-password', payload);
            return res.data;
        },
    });
}
