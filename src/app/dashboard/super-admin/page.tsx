'use client';

import React from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import { useClinics } from '@/hooks/use-clinics';
import { useUsers } from '@/hooks/use-users';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Role } from '@/lib/types';
import { COLORS, BORDER_RADIUS, SHADOWS } from '@/lib/constants/design-tokens';

export default function SuperAdminDashboard() {
    const { data: clinics, isLoading: loadingClinics } = useClinics();
    const { data: users, isLoading: loadingUsers } = useUsers();

    const stats = [
        {
            title: 'Total Clinics',
            value: clinics?.meta.total || 0,
            icon: <BusinessIcon sx={{ fontSize: 32, color: COLORS.primary.main }} />,
            loading: loadingClinics,
        },
        {
            title: 'Total Users',
            value: users?.meta.total || 0,
            icon: <PeopleIcon sx={{ fontSize: 32, color: COLORS.secondary.main }} />,
            loading: loadingUsers,
        },
    ];

    return (
        <ProtectedRoute allowedRoles={[Role.SUPER_ADMIN]}>
            <DashboardLayout title="Dashboard Overview">
                <Box sx={{ p: 4 }}>
                    <Grid container spacing={3}>
                        {stats.map((stat, index) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                                <Card sx={{
                                    borderRadius: BORDER_RADIUS.lg,
                                    boxShadow: SHADOWS.small,
                                    border: `1px solid ${COLORS.border.light}`,
                                    height: '100%',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: SHADOWS.medium,
                                    }
                                }}>
                                    <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                                        <Box sx={{
                                            p: 2,
                                            borderRadius: BORDER_RADIUS.md,
                                            bgcolor: index === 0 ? COLORS.primary.subtle : COLORS.secondary.subtle,
                                            mr: 3,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            {stat.icon}
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" sx={{ color: COLORS.text.secondary, fontWeight: 700, mb: 0.5 }}>
                                                {stat.title}
                                            </Typography>
                                            <Typography variant="h4" fontWeight={900} sx={{ color: COLORS.text.primary, letterSpacing: '-1px' }}>
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
