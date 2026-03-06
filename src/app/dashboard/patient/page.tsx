'use client';

import React from 'react';
import { Typography, Grid, Card, CardContent, Box, Avatar, Chip } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Role } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';

const navItems = [
    { label: 'Overview', href: '/dashboard/patient', icon: <DashboardIcon /> },
    { label: 'My Appointments', href: '/dashboard/patient/appointments', icon: <EventIcon /> },
    { label: 'Book Appointment', href: '/dashboard/patient/book', icon: <CalendarMonthIcon /> },
    { label: 'My Profile', href: '/dashboard/patient/profile', icon: <PersonIcon /> },
    { label: 'Settings', href: '/dashboard/patient/settings', icon: <SettingsIcon /> },
];

const statCards = [
    { title: 'Upcoming Appointments', value: '—', color: '#00BCD4', icon: <EventIcon /> },
    { title: 'Completed Visits', value: '—', color: '#66BB6A', icon: <EventIcon /> },
    { title: 'Cancelled', value: '—', color: '#EF5350', icon: <EventIcon /> },
    { title: 'Profile Complete', value: '—', color: '#AB47BC', icon: <PersonIcon /> },
];

export default function PatientDashboard() {
    const { user } = useAuth();

    return (
        <ProtectedRoute allowedRoles={[Role.PATIENT]}>
            <DashboardLayout navItems={navItems} title="Patient Dashboard">
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
                        Welcome, {user?.firstName}! 💊
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage your appointments and health profile.
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
                        Appointment booking, appointment history, and profile management will be built here.
                    </Typography>
                </Card>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
