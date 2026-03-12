'use client';

import React from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import { useAuth } from '@/lib/auth-context';
import { usePatientStatsCards } from '@/hooks/use-appointments';

export default function PatientHeroBanner() {
    const { user } = useAuth();
    const { data: stats, isLoading } = usePatientStatsCards();

    if (isLoading) {
        return (
            <Skeleton
                variant="rectangular"
                height={200}
                sx={{ borderRadius: 4, mb: 4, width: '100%' }}
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
                borderRadius: 4,
                overflow: 'hidden',
                mb: 4,
                height: 200,
                display: 'flex',
                alignItems: 'center',
                px: 6,
                background: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.3)), url('/patient-background.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'white'
            }}
        >
            <Box>
                <Typography variant="body1" sx={{ opacity: 0.9, mb: 1, fontWeight: 500 }}>
                    {greeting()}, 
                </Typography>
                <Typography variant="h3" fontWeight={800} sx={{ mb: 1, fontSize: { xs: '2rem', md: '3rem' } }}>
                    {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    You have {stats?.today || 0} appointment today.
                </Typography>
            </Box>
        </Box>
    );
}
