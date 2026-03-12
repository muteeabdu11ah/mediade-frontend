'use client';

import React, { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Pagination,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Stack,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Role, AppointmentStatus, Appointment } from '@/lib/types';

// Sub-components
import AppointmentFilters from './components/AppointmentFilters';
import CalendarWeekly from '@/components/Calendar/CalendarWeekly';
import CalendarMonthly from '@/components/Calendar/CalendarMonthly';
import AppointmentCard from './components/AppointmentCard';
import StatusUpdateMenu from './components/StatusUpdateMenu';

import { useAppointments, useDoctorAppointmentStats, useUpdateAppointmentStatus } from '@/hooks/use-appointments';

type ViewMode = 'Weekly' | 'Monthly';

export default function DoctorAppointmentsPage() {
    const [viewMode, setViewMode] = useState<ViewMode>('Weekly');
    const [page, setPage] = useState(1);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedType, setSelectedType] = useState('All');

    // Actions menu state
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    // Calculate start/end for stats fetching
    const statsRange = useMemo(() => {
        const start = new Date(selectedDate);
        const end = new Date(selectedDate);

        if (viewMode === 'Weekly') {
            const day = start.getDay();
            start.setDate(start.getDate() - day);
            end.setDate(start.getDate() + 6);
        } else {
            start.setDate(1);
            end.setMonth(end.getMonth() + 1);
            end.setDate(0);
        }

        return {
            startDate: start.toLocaleDateString('en-CA'),
            endDate: end.toLocaleDateString('en-CA')
        };
    }, [selectedDate, viewMode]);

    // React Query Hooks
    const {
        data: appointmentsData,
        isLoading: appointmentsLoading,
        error: appointmentsError
    } = useAppointments({
        date: selectedDate.toLocaleDateString('en-CA'),
        page,
        limit: 12,
        type: selectedType !== 'All' ? selectedType : undefined
    });

    const {
        data: statsData,
        isLoading: statsLoading
    } = useDoctorAppointmentStats(statsRange);

    const updateStatusMutation = useUpdateAppointmentStatus();

    const appointments = appointmentsData?.data || [];
    const totalPages = appointmentsData?.meta?.totalPages || 1;
    const stats = statsData || {};

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

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        if (viewMode === 'Monthly') {
            setViewMode('Weekly');
        }
    };

    const handleNavigate = (date: Date) => {
        setSelectedDate(date);
        // Do not change viewMode here
    };

    return (
        <ProtectedRoute allowedRoles={[Role.DOCTOR]}>
            <DashboardLayout title="Appointments">
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                    <AppointmentFilters selectedType={selectedType} setSelectedType={setSelectedType} />

                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <Select
                            value={viewMode}
                            onChange={(e) => setViewMode(e.target.value as ViewMode)}
                            sx={{ borderRadius: 2, bgcolor: 'white' }}
                        >
                            <MenuItem value="Weekly">
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <CalendarMonthIcon sx={{ fontSize: 18, color: '#00BCD4' }} />
                                    <Typography variant="body2" fontWeight={600}>Weekly</Typography>
                                </Stack>
                            </MenuItem>
                            <MenuItem value="Monthly">
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <CalendarMonthIcon sx={{ fontSize: 18, color: '#00BCD4' }} />
                                    <Typography variant="body2" fontWeight={600}>Monthly</Typography>
                                </Stack>
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Stack>

                {appointmentsError && <Alert severity="error" sx={{ mb: 3 }}>{(appointmentsError as any)?.message || 'Failed to load data'}</Alert>}

                {viewMode === 'Weekly' ? (
                    <CalendarWeekly
                        selectedDate={selectedDate}
                        onDateSelect={handleDateSelect}
                        onNavigate={handleNavigate}
                        stats={stats}
                    />
                ) : (
                    <CalendarMonthly
                        selectedDate={selectedDate}
                        onDateSelect={handleDateSelect}
                        onNavigate={handleNavigate}
                        stats={stats}
                    />
                )}

                {viewMode === 'Weekly' && (
                    <>
                        {appointmentsLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>
                        ) : (
                            <Grid container spacing={3}>
                                {appointments.length === 0 ? (
                                    <Grid size={{ xs: 12 }}>
                                        <Typography textAlign="center" color="text.secondary" py={4}>No appointments found for this day.</Typography>
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
                    </>
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

