'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Pagination,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Role, OnsiteConsultation } from '@/lib/types';

// Sub-components
import OnsiteFilters from './components/OnsiteFilters';
import OnsiteConsultationCard from './components/OnsiteConsultationCard';
import NewOnsiteModal from './components/NewOnsiteModal';

import { useOnsiteConsultations, useCreateOnsiteConsultation } from '@/hooks/use-onsite-consultations';

export default function OnsiteAppointmentsPage() {
    const [page, setPage] = useState(1);
    const [dateFilter, setDateFilter] = useState('past_6_months');

    // Onsite modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', phone: '', notes: '' });

    // React Query Hooks
    const {
        data: onsiteData,
        isLoading: isLoadingOnsite,
        error: onsiteError
    } = useOnsiteConsultations({
        page,
        limit: 10,
        // dateFilter logic can be expanded in the hook if needed
    });

    const createOnsiteMutation = useCreateOnsiteConsultation();

    const onsiteConsultations = onsiteData?.data || [];
    const totalPages = onsiteData?.meta?.totalPages || 1;

    const handleCreateOnsite = async () => {
        try {
            await createOnsiteMutation.mutateAsync(formData);
            setIsModalOpen(false);
            setFormData({ firstName: '', lastName: '', phone: '', notes: '' });
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to create onsite consultation');
        }
    };

    return (
        <ProtectedRoute allowedRoles={[Role.DOCTOR]}>
            <DashboardLayout title="Onsite Appointments">

                {onsiteError && <Alert severity="error" sx={{ mb: 3 }}>{(onsiteError as any)?.message || 'Failed to load data'}</Alert>}

                <OnsiteFilters
                    dateFilter={dateFilter}
                    setDateFilter={setDateFilter}
                    onNewConsultation={() => setIsModalOpen(true)}
                />

                {isLoadingOnsite ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>
                ) : (
                    <Box>
                        <Grid container spacing={3}>
                            {onsiteConsultations.length === 0 ? (
                                <Grid size={{ xs: 12 }}>
                                    <Typography textAlign="center" color="text.secondary" py={4}>No onsite consultations found for this time range.</Typography>
                                </Grid>
                            ) : (
                                onsiteConsultations.map((consult: OnsiteConsultation) => (
                                    <Grid size={{ xs: 12, md: 6, lg: 4 }} key={consult.id}>
                                        <OnsiteConsultationCard consult={consult} />
                                    </Grid>
                                ))
                            )}
                        </Grid>
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
                    </Box>
                )}

                <NewOnsiteModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleCreateOnsite}
                    isSubmitting={createOnsiteMutation.isPending}
                />
            </DashboardLayout>
        </ProtectedRoute>
    );
}
