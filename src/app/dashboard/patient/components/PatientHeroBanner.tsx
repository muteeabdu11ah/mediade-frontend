'use client';

import React from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import { useAuth } from '@/lib/auth-context';
import { GRADIENTS, COLORS, BORDER_RADIUS, SHADOWS } from '@/lib/constants/design-tokens';
import { usePatientStatsCards } from '@/hooks/use-appointments';

export default function PatientHeroBanner() {
    const { user } = useAuth();
    const { data: stats, isLoading } = usePatientStatsCards();

    if (isLoading) {
        return (
            <Skeleton
                variant="rectangular"
                height={200}
                sx={{ borderRadius: BORDER_RADIUS.lg, mb: 4, width: '100%' }}
            />
        );
    }

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning ⛅';
        if (hour < 18) return 'Good Afternoon ☀️';
        return 'Good Evening';
    };

    return (
        <Box
            sx={{
                position: 'relative',
                borderRadius: BORDER_RADIUS.lg,
                overflow: 'hidden',
                mb: 4,
                height: { xs: 180, md: 220 },
                display: 'flex',
                alignItems: 'center',
                px: { xs: 4, md: 8 },
                background: GRADIENTS.primary,
                boxShadow: SHADOWS.large,
                color: 'white'
            }}
        >
            {/* Decorative background element */}
            <Box sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 250,
                height: 250,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                zIndex: 0
            }} />

            <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography variant="body1" color="white" sx={{ opacity: 0.9, mb: 1 }}>
                    {greeting()}
                </Typography>
                <Typography variant="h3" sx={{ mb: 1.5, fontSize: { xs: '2rem', md: '3.5rem' } }}>
                    {user?.firstName} {user?.lastName}
                </Typography>
                <Box sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    px: 2,
                    py: 0.8,
                    borderRadius: BORDER_RADIUS.full,
                    backdropFilter: 'blur(10px)'
                }}>
                    <Typography variant="body2" color="text.primary">
                        📅 You have {stats?.today || 0} appointment today
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}

