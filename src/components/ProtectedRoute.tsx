'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '@/lib/auth-context';
import { Role } from '@/lib/types';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: Role[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push('/login');
                return;
            }

            if (allowedRoles && user && !allowedRoles.includes(user.role as Role)) {
                router.push('/unauthorized');
            }
        }
    }, [isLoading, isAuthenticated, user, allowedRoles, router]);

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    gap: 2,
                }}
            >
                <CircularProgress size={48} sx={{ color: 'primary.main' }} />
                <Typography variant="body2" color="text.secondary">
                    Loading...
                </Typography>
            </Box>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role as Role)) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    gap: 2,
                }}
            >
                <Typography variant="h5" color="error.main" fontWeight={700}>
                    Access Denied
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    You do not have permission to access this page.
                </Typography>
            </Box>
        );
    }

    return <>{children}</>;
}
