'use client';

import React from 'react';
import { Grid, Card, CardContent, Box, Typography, Avatar, Skeleton } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useDoctorStatsCards } from '@/hooks/use-appointments';

import { COLORS, BORDER_RADIUS, SHADOWS, GRADIENTS } from '@/lib/constants/design-tokens';

const CARD_CONFIGS = [
    { title: "Today's Appointments", key: 'today' as const, icon: <CalendarTodayIcon sx={{ fontSize: 22 }} /> },
    { title: "Upcoming Appointments", key: 'upcoming' as const, icon: <CalendarTodayIcon sx={{ fontSize: 22 }} /> },
    { title: "Completed Appointments", key: 'completed' as const, icon: <CheckCircleOutlineIcon sx={{ fontSize: 22 }} /> },
];

function StatCardSkeleton() {
    return (
        <Card>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Skeleton variant="text" width="60%" height={24} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="circular" width={44} height={44} />
                </Box>
                <Skeleton variant="text" width="40%" height={56} sx={{ borderRadius: 1 }} />
            </CardContent>
        </Card>
    );
}

export default function DoctorStatsCards() {
    const { data: stats, isLoading } = useDoctorStatsCards();

    if (isLoading) {
        return (
            <Grid container spacing={4} sx={{ mb: 4 }}>
                {[0, 1, 2].map((i) => (
                    <Grid size={{ xs: 12, md: 4 }} key={i}>
                        <StatCardSkeleton />
                    </Grid>
                ))}
            </Grid>
        );
    }

    const statCards = stats ? [
        { ...CARD_CONFIGS[0], value: stats.today },
        { ...CARD_CONFIGS[1], value: stats.upcoming },
        { ...CARD_CONFIGS[2], value: stats.completed },
    ] : [];

    return (
        <Grid container spacing={4} sx={{ mb: 4 }}>
            {statCards.map((card, index) => (
                <Grid size={{ xs: 12, md: 4 }} key={index}>
                    <Card
                        sx={{
                            height: '100%',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: SHADOWS.hover
                            }
                        }}
                    >
                        <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="subtitle2" sx={{ color: COLORS.text.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {card.title}
                                </Typography>
                                <Avatar
                                    sx={{
                                        width: 44,
                                        height: 44,
                                        background: COLORS.primary.subtle,
                                        color: COLORS.primary.main,
                                        border: `1px solid ${COLORS.primary.main}15`,
                                        boxShadow: `0 4px 12px ${COLORS.primary.main}20`
                                    }}
                                >
                                    {card.icon}
                                </Avatar>
                            </Box>
                            <Box>
                                <Typography variant="h3" sx={{ fontWeight: 900, color: COLORS.text.primary, letterSpacing: '-1px' }}>
                                    {card.value}
                                </Typography>
                                <Typography variant="caption" sx={{ color: COLORS.success.main, fontWeight: 700, display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                    +12% vs last week
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}
