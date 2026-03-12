'use client';

import React from 'react';
import { Appointment, PaginatedResponse } from '@/lib/types';
import AdvancedDataTable, { ColumnDef } from '@/components/AdvancedDataTable';
import StatusChip from '@/components/StatusChip';
import { format } from 'date-fns';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface PatientHistoryTableProps {
    data: Appointment[];
    isLoading: boolean;
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onSearch?: (term: string) => void;
    onStatusChange?: (status: string) => void;
    onDateChange?: (start: string | undefined, end: string | undefined) => void;
    statusValue?: string;
    searchTerm?: string;
    showFilters?: boolean;
}

export default function PatientHistoryTable({
    data,
    isLoading,
    page,
    totalPages,
    onPageChange,
    onSearch,
    onStatusChange,
    onDateChange,
    statusValue = 'all',
    searchTerm = '',
    showFilters = true,
}: PatientHistoryTableProps) {
    const columns: ColumnDef<Appointment>[] = [
        {
            header: 'Name',
            render: (appt) => `Dr. ${appt.doctor?.firstName} ${appt.doctor?.lastName}`,
        },
        {
            header: 'Specialty',
            render: (appt) => appt.doctor?.doctorProfile?.specialty || appt.type || 'Consultation',
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
            icon: <MoreVertIcon fontSize="small" />,
            onClick: (appt: Appointment) => console.log('View notes for', appt.id),
        },
        {
            label: 'Download Soap Notes',
            icon: <MoreVertIcon fontSize="small" />,
            onClick: (appt: Appointment) => console.log('Download notes for', appt.id),
        }
    ];

    return (
        <AdvancedDataTable
            columns={columns}
            data={data}
            isLoading={isLoading}
            rowKey={(appt) => appt.id}
            onSearch={onSearch}
            searchPlaceholder="Search by doctor name, specialty, or hospital"
            statusOptions={showFilters ? [
                { value: 'completed', label: 'Completed' },
                { value: 'missed', label: 'Missed' },
                { value: 'late', label: 'Late' },
                { value: 'cancelled', label: 'Cancelled' },
            ] : undefined}
            statusValue={statusValue}
            onStatusChange={onStatusChange}
            onDateChange={onDateChange}
            actions={tableActions}
            pagination={{
                page,
                totalPages,
                onPageChange,
            }}
        />
    );
}
