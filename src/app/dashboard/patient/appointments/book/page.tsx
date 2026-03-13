'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Alert,
    Snackbar,
    Fade,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useDoctors } from '@/hooks/use-users';
import DoctorSearchFilters from './components/DoctorSearchFilters';
import DoctorGrid from './components/DoctorGrid';

export default function BookAppointmentPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [page, setPage] = useState(1);

    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [error, setError] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const { data: doctorsRes, isLoading: loadingDoctors, isError } = useDoctors({
        page,
        limit: 12,
        search: debouncedSearch,
        specialty,
    });

    useEffect(() => {
        if (isError) {
            setError('Failed to load doctors. Please try again.');
        }
    }, [isError]);

    const handleDoctorSelect = (doctorId: string) => {
        router.push(`/dashboard/patient/appointments/book/${doctorId}`);
    };

    return (
        <>
            <Fade in timeout={500}>
                <Box>
                    <DoctorSearchFilters
                        search={search}
                        onSearchChange={(val) => { setSearch(val); setPage(1); }}
                        specialty={specialty}
                        onSpecialtyChange={(val) => { setSpecialty(val); setPage(1); }}
                    />
                    <DoctorGrid
                        doctors={doctorsRes?.data || []}
                        loading={loadingDoctors}
                        page={page}
                        totalPages={doctorsRes?.meta.totalPages || 1}
                        onPageChange={setPage}
                        onBook={handleDoctorSelect}
                    />
                </Box>
            </Fade>

            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity="error" sx={{ width: '100%', borderRadius: 3 }}>
                    {error}
                </Alert>
            </Snackbar>
        </>
    );
}
