'use client';

import React from 'react';
import { Typography, Grid, Card, CardContent, Box, Avatar, Chip } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Role } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';

const navItems = [
    { label: 'Overview', href: '/dashboard/doctor', icon: <DashboardIcon /> },
    { label: 'My Schedule', href: '/dashboard/doctor/schedule', icon: <CalendarMonthIcon /> },
    { label: 'My Appointments', href: '/dashboard/doctor/appointments', icon: <EventIcon /> },
    { label: 'Patients', href: '/dashboard/doctor/patients', icon: <PeopleIcon /> },
    { label: 'Settings', href: '/dashboard/doctor/settings', icon: <SettingsIcon /> },
];

const statCards = [
    { title: 'Today\'s Appointments', value: '—', color: '#00BCD4', icon: <EventIcon /> },
    { title: 'Upcoming This Week', value: '—', color: '#42A5F5', icon: <CalendarMonthIcon /> },
    { title: 'Completed Today', value: '—', color: '#66BB6A', icon: <EventIcon /> },
    { title: 'Patients Seen', value: '—', color: '#AB47BC', icon: <PeopleIcon /> },
];

export default function DoctorDashboard() {
    const { user } = useAuth();

    return (
        <ProtectedRoute allowedRoles={[Role.DOCTOR]}>
            <DashboardLayout navItems={navItems} title="Doctor Dashboard">
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
                        Good day, Dr. {user?.lastName}! 🩺
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Here&apos;s your schedule and appointment overview.
                    </Typography>
                </Box>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {statCards.map((card) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.title}>
                            <Card sx={{ bgcolor: 'white' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Avatar sx={{ bgcolor: `${card.color}14`, color: card.color, width: 48, height: 48, borderRadius: 3 }}>
                                            {card.icon}
                                        </Avatar>
                                        <Chip label="Live" size="small" sx={{ bgcolor: 'rgba(102,187,106,0.1)', color: '#66BB6A', fontWeight: 600, fontSize: '0.65rem' }} />
                                    </Box>
                                    <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5, color: card.color }}>{card.value}</Typography>
                                    <Typography variant="body2" color="text.secondary" fontWeight={500}>{card.title}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Card sx={{ bgcolor: 'white', p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: 'text.secondary' }}>
                        🚧 Dashboard Content Coming Soon
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Schedule management, patient list, and appointment details will be built here.
                    </Typography>
                </Card>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
