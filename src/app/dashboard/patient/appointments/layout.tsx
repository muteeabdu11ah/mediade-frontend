'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { BreadcrumbProvider, useBreadcrumbContext } from '@/components/BreadcrumbContext';
import NestedBreadcrumb from '@/components/NestedBreadcrumb';
import { Role } from '@/lib/types';

const SEGMENT_LABELS: Record<string, string> = {
    book: 'Book Appointment',
};

function BreadcrumbWithContext() {
    const { dynamicLabels } = useBreadcrumbContext();

    return (
        <NestedBreadcrumb
            basePath="/dashboard/patient/appointments"
            baseLabel="Appointments"
            segmentLabels={SEGMENT_LABELS}
            resolveDynamicLabel={(seg: string) => dynamicLabels[seg] || null}
        />
    );
}

export default function PatientAppointmentsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute allowedRoles={[Role.PATIENT]}>
            <DashboardLayout title="Appointments">
                <BreadcrumbProvider>
                    <BreadcrumbWithContext />
                    {children}
                </BreadcrumbProvider>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
