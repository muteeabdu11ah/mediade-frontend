'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    CircularProgress,
    Alert,
    Tooltip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';
import CancelIcon from '@mui/icons-material/Cancel';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Role, AppointmentStatus, Appointment } from '@/lib/types';
import api from '@/lib/api';

const navItems = [
    { label: 'Overview', href: '/dashboard/patient', icon: <DashboardIcon /> },
    { label: 'My Appointments', href: '/dashboard/patient/appointments', icon: <EventIcon /> },
    { label: 'Book Appointment', href: '/dashboard/patient/book', icon: <CalendarMonthIcon /> },
    { label: 'My Profile', href: '/dashboard/patient/profile', icon: <PersonIcon /> },
    { label: 'Settings', href: '/dashboard/patient/settings', icon: <SettingsIcon /> },
];

export default function PatientAppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const res = await api.get<Appointment[]>('/appointments/me');
            const sorted = res.data.sort((a, b) => {
                const dateA = new Date(`${a.appointmentDate}T${a.startTime}`);
                const dateB = new Date(`${b.appointmentDate}T${b.startTime}`);
                return dateA.getTime() - dateB.getTime();
            });
            setAppointments(sorted);
            setError('');
        } catch (err) {
            setError('Failed to load appointments.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleCancel = async (id: string) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
        try {
            await api.patch(`/appointments/${id}/status`, { status: AppointmentStatus.CANCELLED });
            await fetchAppointments();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to cancel appointment');
        }
    };

    const getStatusColor = (status: AppointmentStatus) => {
        switch (status) {
            case AppointmentStatus.SCHEDULED: return { bg: 'rgba(66,165,245,0.1)', color: '#42A5F5' };
            case AppointmentStatus.COMPLETED: return { bg: 'rgba(102,187,106,0.1)', color: '#66BB6A' };
            case AppointmentStatus.CANCELLED: return { bg: 'rgba(239,83,80,0.1)', color: '#EF5350' };
            case AppointmentStatus.NO_SHOW: return { bg: 'rgba(171,71,188,0.1)', color: '#AB47BC' };
            default: return { bg: 'rgba(0,0,0,0.05)', color: 'text.secondary' };
        }
    };

    return (
        <ProtectedRoute allowedRoles={[Role.PATIENT]}>
            <DashboardLayout navItems={navItems} title="My Appointments">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box>
                        <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
                            My Appointments
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            View your booking history and upcoming medical visits.
                        </Typography>
                    </Box>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <Card sx={{ bgcolor: 'white', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 5 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead sx={{ bgcolor: 'rgba(0,188,212,0.04)' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Date & Time</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Doctor / Clinic</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textAlign: 'right' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {appointments.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                                                You have no appointments.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        appointments.map((appointment) => {
                                            const statusProps = getStatusColor(appointment.status);
                                            const doctorName = appointment.doctor
                                                ? `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`
                                                : 'Unknown Doctor';
                                            const clinicName = appointment.clinic?.name || 'Unknown Clinic';

                                            return (
                                                <TableRow key={appointment.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    <TableCell>
                                                        <Typography variant="body2" fontWeight={700}>
                                                            {new Date(appointment.appointmentDate).toLocaleDateString()}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                                            {appointment.startTime.substring(0, 5)} - {appointment.endTime.substring(0, 5)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" fontWeight={600} color="primary.dark">
                                                            {doctorName}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {clinicName}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={appointment.status}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: statusProps.bg,
                                                                color: statusProps.color,
                                                                fontWeight: 700,
                                                                fontSize: '0.7rem',
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {appointment.status === AppointmentStatus.SCHEDULED && (
                                                            <Tooltip title="Cancel Appointment">
                                                                <IconButton color="error" onClick={() => handleCancel(appointment.id)}>
                                                                    <CancelIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Card>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
