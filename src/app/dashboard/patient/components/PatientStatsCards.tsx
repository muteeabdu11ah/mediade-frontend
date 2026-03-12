'use client';

import React from 'react';
import { Grid, Card, CardContent, Box, Typography, Avatar, Skeleton } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventNoteIcon from '@mui/icons-material/EventNote';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { usePatientStatsCards } from '@/hooks/use-appointments';

const CARD_CONFIGS = [
    { title: "Today's Appointments", key: 'today' as const, icon: <CalendarTodayIcon sx={{ fontSize: 20 }} />, color: '#00BCD4' },
    { title: "Upcoming Appointments", key: 'upcoming' as const, icon: <EventNoteIcon sx={{ fontSize: 20 }} />, color: '#42A5F5' },
    { title: "Missed Appointments", key: 'missed' as const, icon: <WarningAmberIcon sx={{ fontSize: 20 }} />, color: '#EF5350' },
];

function StatCardSkeleton() {
    return (
        <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #f0f0f0' }}>
            <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Skeleton variant="text" width="60%" height={20} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="circular" width={32} height={32} />
                </Box>
                <Skeleton variant="text" width="40%" height={44} sx={{ borderRadius: 1 }} />
            </CardContent>
        </Card>
    );
}

export default function PatientStatsCards() {
    const { data: stats, isLoading } = usePatientStatsCards();

    if (isLoading) {
        return (
            <Grid container spacing={3} sx={{ mb: 4, mt: -6, position: 'relative', zIndex: 1, px: 3 }}>
                {[0, 1, 2].map((i) => (
                    <Grid size={{ xs: 12, md: 4 }} key={i}>
                        <StatCardSkeleton />
                    </Grid>
                ))}
            </Grid>
        );
    }

    const cards = [
        { ...CARD_CONFIGS[0], value: stats?.today || 0 },
        { ...CARD_CONFIGS[1], value: stats?.upcoming || 0 },
        { ...CARD_CONFIGS[2], value: stats?.missed || 0 },
    ];

    return (
        <Grid container spacing={3} sx={{ mb: 4, mt: -6, position: 'relative', zIndex: 1, px: 3 }}>
            {cards.map((card, index) => (
                <Grid size={{ xs: 12, md: 4 }} key={index}>
                    <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #f0f0f0' }}>
                        <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                    {card.title}
                                </Typography>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: `${card.color}14`, color: card.color }}>
                                    {card.icon}
                                </Avatar>
                            </Box>
                            <Typography variant="h4" fontWeight={800} color="#1A2B3C">
                                {card.value}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}
