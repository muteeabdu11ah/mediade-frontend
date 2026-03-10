'use client';

import React from 'react';
import { Box, Grid, Card, CardContent, Typography, useTheme } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import { useClinics } from '@/hooks/use-clinics';
import { useUsers } from '@/hooks/use-users';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Role } from '@/lib/types';

export default function SuperAdminDashboard() {
    const theme = useTheme();
    const { data: clinics, isLoading: loadingClinics } = useClinics();
    const { data: users, isLoading: loadingUsers } = useUsers();

    const stats = [
        {
            title: 'Total Clinics',
            value: clinics?.meta.total || 0,
            icon: <BusinessIcon sx={{ fontSize: 40, color: '#2EC2C9' }} />,
            loading: loadingClinics,
        },
        {
            title: 'Total Users',
            value: users?.meta.total || 0,
            icon: <PeopleIcon sx={{ fontSize: 40, color: '#35C8C8' }} />,
            loading: loadingUsers,
        },
    ];

    return (
        <ProtectedRoute allowedRoles={[Role.SUPER_ADMIN]}>
            <DashboardLayout title="Dashboard Overview">
                <Box sx={{ p: 4 }}>
                    <Grid container spacing={4}>
                        {stats.map((stat, index) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                                <Card sx={{
                                    borderRadius: 4,
                                    boxShadow: '0 4px 24px rgba(0,0,0,0.02)',
                                    border: '1px solid rgba(0,0,0,0.04)',
                                    height: '100%',
                                }}>
                                    <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                                        <Box sx={{
                                            p: 2,
                                            borderRadius: 3,
                                            bgcolor: 'rgba(46, 194, 201, 0.05)',
                                            mr: 3,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            {stat.icon}
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" fontWeight={600} gutterBottom>
                                                {stat.title}
                                            </Typography>
                                            <Typography variant="h4" fontWeight={800} sx={{ color: '#1A2B3C' }}>
                                                {stat.loading ? '...' : stat.value}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
