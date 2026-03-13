'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Alert,
    Snackbar,
    Fade,
    Grid,
    CircularProgress,
    Typography,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-users';
import { useBookAppointment } from '@/hooks/use-appointments';
import { useBreadcrumbContext } from '@/components/BreadcrumbContext';
import DoctorProfileSection from '../components/DoctorProfileSection';
import SlotPicker from '../components/SlotPicker';
import { COLORS } from '@/lib/constants/design-tokens';

export default function BookDoctorSlotPage() {
    const params = useParams();
    const router = useRouter();
    const doctorId = params.doctorId as string;

    const { data: doctor, isLoading, isError } = useUser(doctorId);
    const bookAppointment = useBookAppointment();
    const { setDynamicLabel } = useBreadcrumbContext();

    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        if (doctor) {
            setDynamicLabel(doctorId, `Dr. ${doctor.firstName} ${doctor.lastName}`);
        }
    }, [doctor, doctorId, setDynamicLabel]);

    const handleSlotSelect = async (date: string, time: string) => {
        if (!doctor) return;

        try {
            await bookAppointment.mutateAsync({
                doctorId: doctor.id,
                appointmentDate: date,
                startTime: time,
                type: 'Consultation',
            });
            setSuccessMsg(`Appointment with Dr. ${doctor.firstName} booked successfully!`);
            setTimeout(() => {
                router.push('/dashboard/patient/appointments');
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to book appointment.');
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress sx={{ color: COLORS.primary.main }} />
            </Box>
        );
    }

    if (isError || !doctor) {
        return (
            <Typography color="error" sx={{ py: 4 }}>
                Doctor not found. Please go back and try again.
            </Typography>
        );
    }

    return (
        <>
            <Fade in timeout={500}>
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                        <DoctorProfileSection doctor={doctor} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 8, lg: 9 }}>
                        <SlotPicker
                            doctorId={doctorId}
                            onSlotSelect={handleSlotSelect}
                        />
                    </Grid>
                </Grid>
            </Fade>

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
        </>
    );
}
