'use client';

import React from 'react';
import { Box } from '@mui/material';
import { useParams } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Role } from '@/lib/types';
import DashboardLayout from '@/components/DashboardLayout';
import ConsultationInterface from '../../consultation/components/ConsultationInterface';

export default function DirectVisitConsultationPage() {
    const params = useParams();
    const consultationId = params.id as string;

    return (
        <ProtectedRoute allowedRoles={[Role.DOCTOR]}>
            <DashboardLayout title="Direct Visit Consultation">
                <Box sx={{ height: '100%', width: '100%' }}>
                    <ConsultationInterface consultationId={consultationId} />
                </Box>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
