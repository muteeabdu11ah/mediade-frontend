'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    Switch,
    FormControlLabel,
    CircularProgress,
    Alert,
    Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import SaveIcon from '@mui/icons-material/Save';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Role, DayOfWeek, DoctorSchedule } from '@/lib/types';
import api from '@/lib/api';

const navItems = [
    { label: 'Dashboard', href: '/dashboard/doctor', icon: <DashboardIcon /> },
    { label: 'Appointments', href: '/dashboard/doctor/appointments', icon: <EventIcon /> },
];

const DAYS_ORDER: DayOfWeek[] = [
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
    DayOfWeek.SATURDAY,
    DayOfWeek.SUNDAY,
];

interface ScheduleFormData {
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
}

const defaultScheduleRow = (day: DayOfWeek): ScheduleFormData => ({
    dayOfWeek: day,
    startTime: '09:00:00',
    endTime: '17:00:00',
    isAvailable: false,
});

export default function DoctorSchedulePage() {
    const [schedules, setSchedules] = useState<Record<DayOfWeek, ScheduleFormData>>({} as any);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const fetchSchedules = async () => {
        try {
            setLoading(true);
            setError('');
            const res = await api.get<DoctorSchedule[]>('/schedules/me');

            const serverData = res.data;
            const initial: Record<string, ScheduleFormData> = {};

            // Initialize all days
            DAYS_ORDER.forEach((day) => {
                const existing = serverData.find((s) => s.dayOfWeek === day);
                if (existing) {
                    initial[day] = {
                        dayOfWeek: day,
                        startTime: existing.startTime,
                        endTime: existing.endTime,
                        isAvailable: existing.isAvailable,
                    };
                } else {
                    initial[day] = defaultScheduleRow(day);
                }
            });

            setSchedules(initial as Record<DayOfWeek, ScheduleFormData>);
        } catch (err: unknown) {
            console.error(err);
            setError('Failed to load schedule. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    const handleChange = (day: DayOfWeek, field: keyof ScheduleFormData, value: any) => {
        setSchedules((prev) => ({
            ...prev,
            [day]: {
                ...prev[day],
                [field]: value,
            },
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        setSuccessMsg('');

        try {
            const payload = {
                schedules: Object.values(schedules),
            };

            await api.post('/schedules/me', payload);
            setSuccessMsg('Schedule updated successfully!');
            await fetchSchedules(); // Reload to get confirmed DB state
        } catch (err: unknown) {
            const errorMessage =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Failed to save schedule.';
            setError(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    return (
        <ProtectedRoute allowedRoles={[Role.DOCTOR]}>
            <DashboardLayout navItems={navItems} title="My Schedule">
                <Box sx={{ maxWidth: 1000, mx: 'auto', mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3 }}>
                        <Box>
                            <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
                                Weekly Schedule
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Set your standard weekly availability and appointment slot durations.
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                            onClick={handleSave}
                            disabled={loading || saving}
                            sx={{
                                px: 4,
                                py: 1.2,
                                background: 'linear-gradient(135deg, #00BCD4 0%, #009688 100%)',
                            }}
                        >
                            Save Schedule
                        </Button>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                    {successMsg && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMsg('')}>{successMsg}</Alert>}

                    {loading ? (
                        <Card sx={{ p: 5, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 3 }}>
                            <CircularProgress />
                        </Card>
                    ) : (
                        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <CardContent sx={{ p: 0 }}>
                                {/* Days Rows */}
                                <Box sx={{ p: 2 }}>
                                    {DAYS_ORDER.map((day, index) => {
                                        const rowData = schedules[day];
                                        if (!rowData) return null;

                                        return (
                                            <Box key={day} sx={{ px: { xs: 1, md: 2 }, py: 2, borderBottom: index === DAYS_ORDER.length - 1 ? 'none' : '1px solid rgba(0,0,0,0.05)' }}>
                                                <Grid container spacing={2} alignItems="center">
                                                    <Grid size={{ xs: 12, md: 2 }}>
                                                        <Typography variant="subtitle1" fontWeight={700} sx={{ textTransform: 'capitalize' }}>
                                                            {day}
                                                        </Typography>
                                                    </Grid>

                                                    <Grid size={{ xs: 6, md: 3 }}>
                                                        <TextField
                                                            type="time"
                                                            fullWidth
                                                            size="small"
                                                            label="Start Time"
                                                            disabled={!rowData.isAvailable}
                                                            value={rowData.startTime} // Backend uses HH:mm:ss, but input type="time" generally handles HH:mm. We need to ensure we save HH:mm:ss.
                                                            onChange={(e) => {
                                                                // e.target.value is HH:mm. Append :00 if missing.
                                                                const val = e.target.value;
                                                                handleChange(day, 'startTime', val.length === 5 ? `${val}:00` : val);
                                                            }}
                                                            slotProps={{
                                                                htmlInput: { step: 300 }, // 5 min interval
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid size={{ xs: 6, md: 3 }}>
                                                        <TextField
                                                            type="time"
                                                            fullWidth
                                                            size="small"
                                                            label="End Time"
                                                            disabled={!rowData.isAvailable}
                                                            value={rowData.endTime}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                handleChange(day, 'endTime', val.length === 5 ? `${val}:00` : val);
                                                            }}
                                                            slotProps={{
                                                                htmlInput: { step: 300 },
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid size={{ xs: 6, md: 2 }} sx={{ textAlign: { xs: 'left', md: 'center' } }}>
                                                        <FormControlLabel
                                                            control={
                                                                <Switch
                                                                    color="primary"
                                                                    checked={rowData.isAvailable}
                                                                    onChange={(e) => handleChange(day, 'isAvailable', e.target.checked)}
                                                                />
                                                            }
                                                            label="Is Available"
                                                            sx={{ m: 0 }}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        );
                                    })}
                                </Box>
                            </CardContent>
                        </Card>
                    )}
                </Box>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
