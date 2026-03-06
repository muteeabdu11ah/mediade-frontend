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
    Menu,
    MenuItem,
    CircularProgress,
    Alert,
    Tooltip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ScheduleIcon from '@mui/icons-material/Schedule';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Role, AppointmentStatus, Appointment } from '@/lib/types';
import api from '@/lib/api';

const navItems = [
    { label: 'Overview', href: '/dashboard/doctor', icon: <DashboardIcon /> },
    { label: 'My Schedule', href: '/dashboard/doctor/schedule', icon: <CalendarMonthIcon /> },
    { label: 'My Appointments', href: '/dashboard/doctor/appointments', icon: <EventIcon /> },
    { label: 'Patients', href: '/dashboard/doctor/patients', icon: <PeopleIcon /> },
    { label: 'Settings', href: '/dashboard/doctor/settings', icon: <SettingsIcon /> },
];

export default function DoctorAppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Actions menu state
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const res = await api.get<Appointment[]>('/appointments/doctor/me');
            // Sort by date/time ascending
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
            await api.patch(`/appointments/${selectedAppointment.id}/status`, { status });
            await fetchAppointments();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to update status');
        }
        handleMenuClose();
    };

    const getStatusColor = (status: AppointmentStatus) => {
        switch (status) {
            case AppointmentStatus.SCHEDULED: return { bg: 'rgba(66,165,245,0.1)', color: '#42A5F5', icon: <ScheduleIcon fontSize="small" /> };
            case AppointmentStatus.COMPLETED: return { bg: 'rgba(102,187,106,0.1)', color: '#66BB6A', icon: <CheckCircleIcon fontSize="small" /> };
            case AppointmentStatus.CANCELLED: return { bg: 'rgba(239,83,80,0.1)', color: '#EF5350', icon: <CancelIcon fontSize="small" /> };
            case AppointmentStatus.NO_SHOW: return { bg: 'rgba(171,71,188,0.1)', color: '#AB47BC', icon: <HelpOutlineIcon fontSize="small" /> };
            default: return { bg: 'rgba(0,0,0,0.05)', color: 'text.secondary', icon: <HelpOutlineIcon fontSize="small" /> };
        }
    };

    return (
        <ProtectedRoute allowedRoles={[Role.DOCTOR]}>
            <DashboardLayout navItems={navItems} title="Appointments">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box>
                        <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
                            Incoming Appointments
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            View and manage your scheduled patient visits.
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
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Patient</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Notes</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textAlign: 'right' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {appointments.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                                                No appointments found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        appointments.map((appointment) => {
                                            const statusProps = getStatusColor(appointment.status);
                                            const patientName = appointment.patient
                                                ? `${appointment.patient!.firstName} ${appointment.patient.lastName}`
                                                : 'Unknown Patient';

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
                                                        <Typography variant="body2" fontWeight={600}>
                                                            {patientName}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {appointment.patient?.email}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            {appointment.notes || 'No notes provided'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={appointment.status}
                                                            size="small"
                                                            icon={statusProps.icon}
                                                            sx={{
                                                                bgcolor: statusProps.bg,
                                                                color: statusProps.color,
                                                                fontWeight: 700,
                                                                fontSize: '0.7rem',
                                                                '& .MuiChip-icon': { color: 'inherit' }
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {appointment.status === AppointmentStatus.SCHEDULED && (
                                                            <>
                                                                <Tooltip title="Update Status">
                                                                    <IconButton onClick={(e) => handleMenuOpen(e, appointment)}>
                                                                        <MoreVertIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </>
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

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                        elevation: 3,
                        sx: { borderRadius: 2, minWidth: 150, mt: 1 }
                    }}
                >
                    <MenuItem onClick={() => handleUpdateStatus(AppointmentStatus.COMPLETED)} sx={{ color: '#66BB6A', fontWeight: 600 }}>
                        <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} /> Mark Completed
                    </MenuItem>
                    <MenuItem onClick={() => handleUpdateStatus(AppointmentStatus.NO_SHOW)} sx={{ color: '#AB47BC', fontWeight: 600 }}>
                        <HelpOutlineIcon fontSize="small" sx={{ mr: 1 }} /> Mark No-Show
                    </MenuItem>
                    <MenuItem onClick={() => handleUpdateStatus(AppointmentStatus.CANCELLED)} sx={{ color: '#EF5350', fontWeight: 600 }}>
                        <CancelIcon fontSize="small" sx={{ mr: 1 }} /> Cancel Appointment
                    </MenuItem>
                </Menu>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
