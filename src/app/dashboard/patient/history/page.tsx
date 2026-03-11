'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Role, Appointment } from '@/lib/types';
import PageHeader from '@/components/PageHeader';
import { usePatientAppointments } from '@/hooks/use-appointments';
import AdvancedDataTable, { ColumnDef } from '@/components/AdvancedDataTable';
import StatusChip from '@/components/StatusChip';
import { format } from 'date-fns';
import { Box, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DashboardLayout from '@/components/DashboardLayout';

export default function PatientHistoryPage() {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState<string | undefined>();
    const [endDate, setEndDate] = useState<string | undefined>();

    const { data: response, isLoading } = usePatientAppointments({
        isHistory: true,
        page,
        limit: 10,
        search: searchTerm || undefined,
        startDate,
        endDate,
    });

    const columns: ColumnDef<Appointment>[] = [
        {
            header: 'Name',
            render: (appt) => `Dr. ${appt.doctor?.firstName} ${appt.doctor?.lastName}`,
        },
        {
            header: 'Specialty',
            render: (appt) => appt.doctor?.doctorProfile?.specialty || 'Consultation', // Fallback designation from Appointment Type for now
        },
        {
            header: 'Clinic',
            render: (appt) => appt.clinic?.name || '—',
        },
        {
            header: 'Status',
            render: (appt) => <StatusChip status={appt.status} />,
        },
        {
            header: 'Date & Time',
            render: (appt) => {
                const dateStr = format(new Date(appt.appointmentDate), 'dd/MM/yyyy');
                // Format time like "9pm" 
                let timeStr = appt.startTime;
                if (timeStr) {
                    const [hour] = timeStr.split(':');
                    const h = parseInt(hour, 10);
                    const ampm = h >= 12 ? 'pm' : 'am';
                    const h12 = h % 12 || 12;
                    timeStr = `${h12}${ampm}`;
                }
                return `${timeStr} - ${dateStr}`;
            },
        },
    ];

    const tableActions = [
        {
            label: 'View Soap Notes',
            icon: <MoreVertIcon fontSize="small" />, // Placeholder icon, you can swap with VisibilityIcon
            onClick: (appt: Appointment) => console.log('View notes for', appt.id),
        },
        {
            label: 'Download Soap Notes',
            icon: <MoreVertIcon fontSize="small" />, // Placeholder icon, you can swap with DownloadIcon
            onClick: (appt: Appointment) => console.log('Download notes for', appt.id),
        }
    ];

    let displayData: Appointment[] = response?.data || [];
    if (statusFilter !== 'all') {
        displayData = displayData.filter((a) => a.status === statusFilter);
    }

    return (
        <ProtectedRoute allowedRoles={[Role.PATIENT]}>
            <DashboardLayout title="History" >
                {/* <PageHeader title="History" /> */}
                <AdvancedDataTable
                    columns={columns}
                    data={displayData}
                    isLoading={isLoading}
                    rowKey={(appt) => appt.id}
                    onSearch={setSearchTerm}
                    searchPlaceholder="Search by doctor name, specialty, or hospital"
                    statusOptions={[
                        { value: 'completed', label: 'Completed' },
                        { value: 'missed', label: 'Missed' },
                        { value: 'late', label: 'Late' },
                        { value: 'cancelled', label: 'Cancelled' },
                    ]}
                    statusValue={statusFilter}
                    onStatusChange={setStatusFilter}
                    onDateChange={(start, end) => {
                        if (start !== undefined) setStartDate(start);
                        if (end !== undefined) setEndDate(end);
                    }}
                    actions={tableActions}
                    pagination={
                        response?.meta
                            ? {
                                page: response.meta.page,
                                totalPages: response.meta.totalPages,
                                onPageChange: setPage,
                            }
                            : undefined
                    }
                />
            </DashboardLayout>
        </ProtectedRoute>
    );
}
