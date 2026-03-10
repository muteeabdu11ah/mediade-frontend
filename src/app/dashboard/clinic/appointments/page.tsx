'use client';

import React, { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    Menu,
    MenuItem,
    IconButton,
    Tooltip,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import DataTable, { ColumnDef } from '@/components/DataTable';
import StatusChip from '@/components/StatusChip';
import PageHeader from '@/components/PageHeader';
import { useClinicAppointments, useUpdateAppointmentStatus } from '@/hooks/use-appointments';
import { Role, AppointmentStatus, Appointment } from '@/lib/types';

// ─── Status preset mapping ─────────────────────────────────────────────────

const statusPresetMap: Record<string, string> = {
    [AppointmentStatus.UPCOMING]: 'upcoming',
    [AppointmentStatus.COMPLETED]: 'completed',
    [AppointmentStatus.CANCELLED]: 'cancelled',
    [AppointmentStatus.MISSED]: 'missed',
};

// ─── Page Component ─────────────────────────────────────────────────────────

export default function ClinicAppointmentsPage() {
    const { data: appointments = [], isLoading } = useClinicAppointments();
    const updateStatus = useUpdateAppointmentStatus();

    // Sort by date/time ascending
    const sorted = useMemo(() => {
        return [...appointments].sort((a, b) => {
            const dateA = new Date(`${a.appointmentDate}T${a.startTime}`);
            const dateB = new Date(`${b.appointmentDate}T${b.startTime}`);
            return dateA.getTime() - dateB.getTime();
        });
    }, [appointments]);

    // Menu state
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

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
        await updateStatus.mutateAsync({ id: selectedAppointment.id, status });
        handleMenuClose();
    };

    // ── Column Definitions ──────────────────────────────────────────────────

    const columns: ColumnDef<Appointment>[] = [
        {
            header: 'Date & Time',
            render: (appt) => (
                <Box>
                    <Typography variant="body2" fontWeight={700}>
                        {new Date(appt.appointmentDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        {appt.startTime.substring(0, 5)} - {appt.endTime.substring(0, 5)}
                    </Typography>
                </Box>
            ),
        },
        {
            header: 'Doctor',
            render: (appt) => (
                <Typography variant="body2" fontWeight={600} color="primary.dark">
                    {appt.doctor ? `Dr. ${appt.doctor.firstName} ${appt.doctor.lastName}` : 'Unknown Doctor'}
                </Typography>
            ),
        },
        {
            header: 'Patient',
            render: (appt) => (
                <Box>
                    <Typography variant="body2" fontWeight={600}>
                        {appt.patient ? `${appt.patient.firstName} ${appt.patient.lastName}` : 'Unknown Patient'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {appt.patient?.phone || appt.patient?.email}
                    </Typography>
                </Box>
            ),
        },
        {
            header: 'Status',
            render: (appt) => (
                <StatusChip status={statusPresetMap[appt.status] || appt.status} />
            ),
        },
        {
            header: 'Actions',
            align: 'right',
            render: (appt) =>
                appt.status === AppointmentStatus.UPCOMING ? (
                    <Tooltip title="Update Status">
                        <IconButton onClick={(e) => handleMenuOpen(e, appt)}>
                            <MoreVertIcon />
                        </IconButton>
                    </Tooltip>
                ) : null,
        },
    ];

    // ── Render ───────────────────────────────────────────────────────────────

    return (
        <ProtectedRoute allowedRoles={[Role.CLINIC_ADMIN, Role.RECEPTIONIST]}>
            <DashboardLayout title="Clinic Appointments">
                <Box sx={{ p: 4 }}>
                    <PageHeader
                        title="Clinic Appointments"
                        subtitle="View and manage all appointments across your clinic."
                    />

                    <DataTable<Appointment>
                        columns={columns}
                        data={sorted}
                        isLoading={isLoading}
                        emptyMessage="No appointments found."
                        rowKey={(a) => a.id}
                    />

                    {/* Status Update Menu */}
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        PaperProps={{
                            elevation: 3,
                            sx: { borderRadius: 2, minWidth: 150, mt: 1 },
                        }}
                    >
                        <MenuItem
                            onClick={() => handleUpdateStatus(AppointmentStatus.COMPLETED)}
                            sx={{ color: '#66BB6A', fontWeight: 600 }}
                        >
                            <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} /> Mark Completed
                        </MenuItem>
                        <MenuItem
                            onClick={() => handleUpdateStatus(AppointmentStatus.MISSED)}
                            sx={{ color: '#AB47BC', fontWeight: 600 }}
                        >
                            <HelpOutlineIcon fontSize="small" sx={{ mr: 1 }} /> Mark No-Show
                        </MenuItem>
                        <MenuItem
                            onClick={() => handleUpdateStatus(AppointmentStatus.CANCELLED)}
                            sx={{ color: '#EF5350', fontWeight: 600 }}
                        >
                            <CancelIcon fontSize="small" sx={{ mr: 1 }} /> Cancel Appointment
                        </MenuItem>
                    </Menu>
                </Box>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
