'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api from './api';
import { API_ENDPOINTS } from './constants/api-endpoints';
import { ROLE_DASHBOARD_ROUTES } from './constants/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Role,
    type AuthResponse,
    type ProfileResponse,
    type LoginRequest,
    type RegisterRequest,
} from './types';

interface AuthContextType {
    user: ProfileResponse | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
    refreshProfile: () => Promise<void>;
    getDashboardRoute: () => string;
    loginMutation: any; // Type as needed or use generic
    registerMutation: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<ProfileResponse | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const queryClient = useQueryClient();

    const getDashboardRoute = useCallback(() => {
        if (!user) return '/login';
        return ROLE_DASHBOARD_ROUTES[user.role as Role] || '/login';
    }, [user]);

    // Load user profile from cookie on initial mount
    useEffect(() => {
        const initAuth = async () => {
            const savedToken = Cookies.get('accessToken');
            if (savedToken) {
                try {
                    setToken(savedToken);
                    const response = await api.get<ProfileResponse>(API_ENDPOINTS.AUTH.ME);
                    setUser(response.data);
                } catch {
                    handleLogoutLocal();
                }
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const handleLogoutLocal = useCallback(() => {
        Cookies.remove('accessToken');
        Cookies.remove('userRole');
        setToken(null);
        setUser(null);
        queryClient.clear();
    }, [queryClient]);

    const loginMutation = useMutation({
        mutationFn: async (data: LoginRequest) => {
            const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
            return response.data;
        },
        onSuccess: async (data) => {
            const { accessToken, user: userData } = data;
            Cookies.set('accessToken', accessToken, { expires: 7 });
            Cookies.set('userRole', userData.role, { expires: 7 });
            setToken(accessToken);

            // Fetch full profile immediately
            try {
                const profileResponse = await api.get<ProfileResponse>(API_ENDPOINTS.AUTH.ME, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setUser(profileResponse.data);

                const dashboardRoute = ROLE_DASHBOARD_ROUTES[userData.role as Role] || '/dashboard/patient';
                router.replace(dashboardRoute);
            } catch (error) {
                console.error('Failed to fetch profile after login:', error);
            }
        },
    });

    const registerMutation = useMutation({
        mutationFn: async (data: RegisterRequest) => {
            const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
            return response.data;
        },
        onSuccess: async (data) => {
            const { accessToken, user: userData } = data;
            Cookies.set('accessToken', accessToken, { expires: 7 });
            Cookies.set('userRole', userData.role, { expires: 7 });
            setToken(accessToken);

            try {
                const profileResponse = await api.get<ProfileResponse>(API_ENDPOINTS.AUTH.ME, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setUser(profileResponse.data);
                router.replace('/dashboard/patient');
            } catch (error) {
                console.error('Failed to fetch profile after registration:', error);
            }
        },
    });

    const logout = () => {
        handleLogoutLocal();
        router.push('/login');
    };

    const refreshProfile = async () => {
        try {
            const response = await api.get<ProfileResponse>(API_ENDPOINTS.AUTH.ME);
            setUser(response.data);
        } catch (error) {
            console.error('Failed to refresh profile:', error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                isAuthenticated: !!user && !!token,
                login: async (data) => { await loginMutation.mutateAsync(data); },
                register: async (data) => { await registerMutation.mutateAsync(data); },
                logout,
                refreshProfile,
                getDashboardRoute,
                loginMutation,
                registerMutation,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
