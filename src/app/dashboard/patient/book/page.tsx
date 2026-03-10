'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    CircularProgress,
    Alert,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Role } from '@/lib/types';
import api from '@/lib/api';

export default function BookAppointmentPage() {
    const [doctorId, setDoctorId] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [notes, setNotes] = useState('');

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleBook = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccessMsg('');

        try {
            const payload = {
                doctorId,
                appointmentDate,
                startTime: startTime.length === 5 ? `${startTime}:00` : startTime,
                notes: notes || undefined,
            };

            await api.post('/appointments', payload);
            setSuccessMsg('Appointment booked successfully!');

            // Reset form
            setDoctorId('');
            setAppointmentDate('');
            setStartTime('');
            setNotes('');
        } catch (err: unknown) {
            const errorMessage =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Failed to book appointment or slot unavailable.';
            setError(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    return (
        <ProtectedRoute allowedRoles={[Role.PATIENT]}>
            <DashboardLayout title="Book Appointment">
                <Box sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box>
                            <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
                                Book Appointment
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Schedule a visit with your preferred doctor.
                            </Typography>
                        </Box>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                    {successMsg && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMsg('')}>{successMsg}</Alert>}

                    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <Box component="form" onSubmit={handleBook}>
                            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontStyle: 'italic' }}>
                                    Note: Until public endpoints for listing clinics and doctors are available, you must enter the exact Doctor ID.
                                </Typography>

                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            fullWidth
                                            label="Doctor ID"
                                            required
                                            value={doctorId}
                                            onChange={(e) => setDoctorId(e.target.value)}
                                            placeholder="e.g., 550e8400-e29b-41d4-a716-446655440000"
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            fullWidth
                                            label="Date"
                                            type="date"
                                            required
                                            value={appointmentDate}
                                            onChange={(e) => setAppointmentDate(e.target.value)}
                                            slotProps={{ inputLabel: { shrink: true } }}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            fullWidth
                                            label="Start Time (HH:mm)"
                                            type="time"
                                            required
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                            slotProps={{ inputLabel: { shrink: true }, htmlInput: { step: 300 } }}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            fullWidth
                                            label="Reason for Visit / Notes (Optional)"
                                            multiline
                                            rows={3}
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                        />
                                    </Grid>
                                </Grid>

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={saving || !doctorId || !appointmentDate || !startTime}
                                        startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <EventAvailableIcon />}
                                        sx={{
                                            px: 4,
                                            py: 1.2,
                                            background: 'linear-gradient(135deg, #00BCD4 0%, #009688 100%)',
                                        }}
                                    >
                                        Confirm Booking
                                    </Button>
                                </Box>
                            </CardContent>
                        </Box>
                    </Card>
                </Box>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
