'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Container,
    IconButton,
    Breadcrumbs,
    Link,
    Alert,
    Snackbar,
    Fade,
    Grid,
    Button,
} from '@mui/material';
import { ChevronLeft, ArrowBack } from '@mui/icons-material';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Role, PaginatedResponse, User } from '@/lib/types';
import api from '@/lib/api';
import DoctorSearchFilters from './components/DoctorSearchFilters';
import DoctorGrid from './components/DoctorGrid';
import DoctorProfileSection from './components/DoctorProfileSection';
import SlotPicker from './components/SlotPicker';
import { GRADIENTS, COLORS } from '@/lib/constants/design-tokens';

enum BookingStep {
    SEARCH = 0,
    SLOTS = 1,
}

export default function BookAppointmentPage() {
    const [step, setStep] = useState<BookingStep>(BookingStep.SEARCH);
    const [search, setSearch] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [page, setPage] = useState(1);
    const [doctorsRes, setDoctorsRes] = useState<PaginatedResponse<User> | null>(null);
    const [loadingDoctors, setLoadingDoctors] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<User | null>(null);

    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const fetchDoctors = useCallback(async () => {
        setLoadingDoctors(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '12',
                ...(search && { search }),
                ...(specialty && { specialty }),
            });
            const res = await api.get(`/users/doctors?${params.toString()}`);
            setDoctorsRes(res.data);
        } catch (err) {
            setError('Failed to load doctors. Please try again.');
        } finally {
            setLoadingDoctors(false);
        }
    }, [page, search, specialty]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchDoctors();
        }, 500); // 500ms debounce
        return () => clearTimeout(timer);
    }, [fetchDoctors]);

    const handleDoctorSelect = (doctorId: string) => {
        const doctor = doctorsRes?.data.find(d => d.id === doctorId);
        if (doctor) {
            setSelectedDoctor(doctor);
            setStep(BookingStep.SLOTS);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSlotSelect = async (date: string, time: string) => {
        if (!selectedDoctor) return;

        try {
            await api.post('/appointments', {
                doctorId: selectedDoctor.id,
                appointmentDate: date,
                startTime: time,
                type: 'Consultation',
            });
            setSuccessMsg(`Appointment with Dr. ${selectedDoctor.firstName} booked successfully!`);
            setStep(BookingStep.SEARCH);
            setSelectedDoctor(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to book appointment.');
        }
    };

    return (
        <ProtectedRoute allowedRoles={[Role.PATIENT]}>
            <DashboardLayout title="Book Appointment">
                {/* <Container maxWidth="xl" sx={{ py: 0 }}> */}
                {/* Header Section */}
                <Box sx={{ mb: 4 }}>
                    {/* <Typography variant="h4" fontWeight={800} sx={{ color: '#2D3748', mb: 1 }}>
                            {step === BookingStep.SEARCH ? 'Book Appointment' : 'Select Date & Time'}
                        </Typography> */}
                    <Typography variant="h3" color="text.primary">
                        {step === BookingStep.SEARCH
                            ? 'Find a doctor and schedule your visit'
                            : `Booking with Dr. ${selectedDoctor?.firstName} ${selectedDoctor?.lastName}`
                        }
                    </Typography>
                </Box>

                {/* Step Navigation for Slots View */}
                {step === BookingStep.SLOTS && (
                    <Box sx={{ mb: 4 }}>
                        <Button
                            startIcon={<ArrowBack />}
                            onClick={() => setStep(BookingStep.SEARCH)}
                            sx={{ textTransform: 'none', color: COLORS.primary.main }}
                        >
                            Back to Doctors
                        </Button>
                    </Box>
                )}

                {/* Content Section */}
                <Fade in timeout={500}>
                    <Box>
                        {step === BookingStep.SEARCH ? (
                            <>
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
                            </>
                        ) : (
                            <Grid container spacing={4}>
                                <Grid size={{ xs: 12, md: 4, lg: 3 }} >
                                    <DoctorProfileSection doctor={selectedDoctor} />
                                </Grid>
                                <Grid size={{ xs: 12, md: 8, lg: 9 }}>
                                    <SlotPicker
                                        doctorId={selectedDoctor?.id || ''}
                                        onSlotSelect={handleSlotSelect}
                                    />
                                </Grid>
                            </Grid>
                        )}
                    </Box>
                </Fade>

                {/* Notifications */}
                <Snackbar
                    open={!!successMsg}
                    autoHideDuration={6000}
                    onClose={() => setSuccessMsg('')}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert severity="success" sx={{ width: '100%', borderRadius: 3 }}>
                        {successMsg}
                    </Alert>
                </Snackbar>

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
                {/* </Container> */}
            </DashboardLayout>
        </ProtectedRoute>
    );
}
