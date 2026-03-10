'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Pagination,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Role, AppointmentStatus, Appointment } from '@/lib/types';

// Sub-components
import AppointmentFilters from './components/AppointmentFilters';
import DateCarousel from './components/DateCarousel';
import AppointmentCard from './components/AppointmentCard';
import StatusUpdateMenu from './components/StatusUpdateMenu';

import { useAppointments, useUpdateAppointmentStatus } from '@/hooks/use-appointments';

export default function DoctorAppointmentsPage() {
    const [page, setPage] = useState(1);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedType, setSelectedType] = useState('All');

    // Actions menu state
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    // React Query Hooks
    const {
        data: appointmentsData,
        isLoading,
        error
    } = useAppointments({
        date: selectedDate.toLocaleDateString('en-CA'),
        page,
        limit: 10,
        type: selectedType !== 'All' ? selectedType : undefined
    });

    const updateStatusMutation = useUpdateAppointmentStatus();

    const appointments = appointmentsData?.data || [];
    const totalPages = appointmentsData?.meta?.totalPages || 1;

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, appointment: Appointment) => {
        setAnchorEl(event.currentTarget);
        setSelectedAppointment(appointment);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedAppointment(null);
    };

    const handleUpdateStatus = async (status: AppointmentStatus) => {
        if (!selectedAppointment) return;
        try {
            await updateStatusMutation.mutateAsync({ id: selectedAppointment.id, status });
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to update status');
        }
        handleMenuClose();
    };

    return (
        <ProtectedRoute allowedRoles={[Role.DOCTOR]}>
            <DashboardLayout title="Appointments">
                {error && <Alert severity="error" sx={{ mb: 3 }}>{(error as any)?.message || 'Failed to load data'}</Alert>}
                <DateCarousel
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    appointmentsCount={appointments.length}
                />

                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>
                ) : (
                    <Grid container spacing={3}>
                        {appointments.length === 0 ? (
                            <Grid size={{ xs: 12 }}>
                                <Typography textAlign="center" color="text.secondary" py={4}>No appointments found for this view.</Typography>
                            </Grid>
                        ) : (
                            appointments.map((appt: Appointment) => (
                                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={appt.id}>
                                    <AppointmentCard appointment={appt} onMenuOpen={handleMenuOpen} />
                                </Grid>
                            ))
                        )}
                    </Grid>
                )}

                {totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={(_, value) => setPage(value)}
                            color="primary"
                            size="large"
                            shape="rounded"
                        />
                    </Box>
                )}

                <StatusUpdateMenu
                    anchorEl={anchorEl}
                    onClose={handleMenuClose}
                    onStatusUpdate={handleUpdateStatus}
                />

            </DashboardLayout>
        </ProtectedRoute>
    );
}

