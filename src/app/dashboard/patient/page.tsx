'use client';

import React, { useState } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Role } from '@/lib/types';
import PatientHeroBanner from './components/PatientHeroBanner';
import PatientStatsCards from './components/PatientStatsCards';
import PatientTotalChart from './components/PatientTotalChart';
import PatientUpcomingList from './components/PatientUpcomingList';
import PatientHistoryTable from './components/PatientHistoryTable';
import { usePatientAppointments } from '@/hooks/use-appointments';

export default function PatientDashboard() {
    const [page, setPage] = useState(1);

    // Fetch only a small slice for the dashboard
    const { data: response, isLoading: tableLoading } = usePatientAppointments({
        isHistory: true,
        page,
        limit: 5,
    });

    return (
        <ProtectedRoute allowedRoles={[Role.PATIENT]}>
            <DashboardLayout title="Dashboard">
                {/* Hero section */}
                <PatientHeroBanner />

                {/* Floating stat cards */}
                <PatientStatsCards />

                {/* Main grid for charts and lists */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, lg: 7, xl: 8 }}>
                        <PatientTotalChart />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 5, xl: 4 }}>
                        <PatientUpcomingList />
                    </Grid>
                </Grid>

                {/* Recent History Table */}
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight={700} color="#1A2B3C">
                        Appointments History
                    </Typography>
                </Box>
                <PatientHistoryTable
                    data={response?.data || []}
                    isLoading={tableLoading}
                    page={response?.meta?.page || 1}
                    totalPages={response?.meta?.totalPages || 1}
                    onPageChange={setPage}
                    showFilters={false} // Cleaner look for dashboard
                />
            </DashboardLayout>
        </ProtectedRoute>
    );
}
