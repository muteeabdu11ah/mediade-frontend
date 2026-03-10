'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '@/lib/auth-context';

export default function DashboardRoot() {
    const { getDashboardRoute } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const route = getDashboardRoute();
        router.replace(route);
    }, [getDashboardRoute, router]);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <CircularProgress />
        </Box>
    );
}
