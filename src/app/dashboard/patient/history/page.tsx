'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Role } from '@/lib/types';
import { usePatientAppointments } from '@/hooks/use-appointments';
import DashboardLayout from '@/components/DashboardLayout';
import PatientHistoryTable from '../components/PatientHistoryTable';

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

    let displayData = response?.data || [];
    if (statusFilter !== 'all') {
        displayData = displayData.filter((a) => a.status === statusFilter);
    }

    return (
        <ProtectedRoute allowedRoles={[Role.PATIENT]}>
            <DashboardLayout title="History" >
                <PatientHistoryTable
                    data={displayData}
                    isLoading={isLoading}
                    page={response?.meta?.page || 1}
                    totalPages={response?.meta?.totalPages || 1}
                    onPageChange={setPage}
                    onSearch={setSearchTerm}
                    onStatusChange={setStatusFilter}
                    onDateChange={(start, end) => {
                        setStartDate(start);
                        setEndDate(end);
                    }}
                    statusValue={statusFilter}
                    searchTerm={searchTerm}
                    showFilters={true}
                />
            </DashboardLayout>
        </ProtectedRoute>
    );
}
