'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api from './api';
import {
    Role,
    ROLE_DASHBOARD_ROUTES,
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<ProfileResponse | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

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
                    const response = await api.get<ProfileResponse>('/auth/profile');
                    setUser(response.data);
                } catch {
                    Cookies.remove('accessToken');
                    setToken(null);
                    setUser(null);
                }
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = async (data: LoginRequest) => {
        const response = await api.post<AuthResponse>('/auth/login', data);
        const { accessToken, user: userData } = response.data;

        Cookies.set('accessToken', accessToken, { expires: 7 });
        setToken(accessToken);

        // Fetch full profile
        const profileResponse = await api.get<ProfileResponse>('/auth/profile', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUser(profileResponse.data);

        // Redirect based on role
        const dashboardRoute = ROLE_DASHBOARD_ROUTES[userData.role as Role];
        router.push(dashboardRoute || '/dashboard/patient');
    };

    const register = async (data: RegisterRequest) => {
        const response = await api.post<AuthResponse>('/auth/register', data);
        const { accessToken } = response.data;

        Cookies.set('accessToken', accessToken, { expires: 7 });
        setToken(accessToken);

        // Fetch full profile
        const profileResponse = await api.get<ProfileResponse>('/auth/profile', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUser(profileResponse.data);

        router.push('/dashboard/patient');
    };

    const logout = () => {
        Cookies.remove('accessToken');
        setToken(null);
        setUser(null);
        router.push('/login');
    };

    const refreshProfile = async () => {
        try {
            const response = await api.get<ProfileResponse>('/auth/profile');
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
                login,
                register,
                logout,
                refreshProfile,
                getDashboardRoute,
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
