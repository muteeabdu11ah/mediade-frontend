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
import AdvancedDataTable, { ColumnDef } from '@/components/AdvancedDataTable';
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

// ─── Status presets for filter select ───────────────────────────────────────

const statusOptions = [
    { value: AppointmentStatus.UPCOMING, label: 'Upcoming' },
    { value: AppointmentStatus.COMPLETED, label: 'Completed' },
    { value: AppointmentStatus.CANCELLED, label: 'Cancelled' },
    { value: AppointmentStatus.MISSED, label: 'No-Show' },
    { value: AppointmentStatus.LATE, label: 'Late' },
];

export default function ClinicAppointmentsPage() {
    // ── Pagination & Filter State ───────────────────────────────────────────
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('all');
    const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({});

    // Fetch Data
    const { data, isLoading } = useClinicAppointments({
        page,
        limit,
        search,
        status,
        startDate: dateRange.start,
        endDate: dateRange.end,
    });

    const appointments = data?.data || [];
    const pagination = data?.meta;

    const updateStatus = useUpdateAppointmentStatus();

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

    const handleUpdateStatus = async (newStatus: AppointmentStatus) => {
        if (!selectedAppointment) return;
        await updateStatus.mutateAsync({ id: selectedAppointment.id, status: newStatus });
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
            align: 'center',
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
                <AdvancedDataTable<Appointment>
                    columns={columns}
                    data={appointments}
                    isLoading={isLoading}
                    emptyMessage="No appointments found."
                    rowKey={(a) => a.id}
                    // Search
                    onSearch={(val) => {
                        setSearch(val);
                        setPage(1);
                    }}
                    searchPlaceholder="Search by doctor or patient name..."
                    // Status
                    statusOptions={statusOptions}
                    statusValue={status}
                    onStatusChange={(val) => {
                        setStatus(val);
                        setPage(1);
                    }}
                    // Date
                    onDateChange={(date) => {
                        setDateRange({ start: date, end: date });
                        setPage(1);
                    }}
                    // Pagination
                    pagination={pagination ? {
                        page: pagination.page,
                        totalPages: pagination.totalPages,
                        onPageChange: (p) => setPage(p),
                    } : undefined}
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
            </DashboardLayout>
        </ProtectedRoute>
    );
}

