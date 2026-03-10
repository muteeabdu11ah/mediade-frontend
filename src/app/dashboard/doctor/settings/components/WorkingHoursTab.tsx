'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    TextField,
    Switch,
    FormControlLabel,
    CircularProgress,
    Alert,
    Divider,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { DayOfWeek } from '@/lib/types';
import { useSchedules, ScheduleFormData } from '@/hooks/use-schedules';

const DAYS_ORDER: DayOfWeek[] = [
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
    DayOfWeek.SATURDAY,
    DayOfWeek.SUNDAY,
];

const defaultScheduleRow = (day: DayOfWeek): ScheduleFormData => ({
    dayOfWeek: day,
    startTime: '09:00:00',
    endTime: '17:00:00',
    isAvailable: false,
});

export default function WorkingHoursTab() {
    const { schedules: serverSchedules, isLoading, updateSchedules, isSaving } = useSchedules();
    const [localSchedules, setLocalSchedules] = useState<Record<DayOfWeek, ScheduleFormData>>({} as any);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        if (serverSchedules) {
            const initial: Record<string, ScheduleFormData> = {};
            DAYS_ORDER.forEach((day) => {
                const existing = serverSchedules.find((s) => s.dayOfWeek === day);
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
            setLocalSchedules(initial as Record<DayOfWeek, ScheduleFormData>);
        }
    }, [serverSchedules]);

    const handleChange = (day: DayOfWeek, field: keyof ScheduleFormData, value: any) => {
        setLocalSchedules((prev) => ({
            ...prev,
            [day]: {
                ...prev[day],
                [field]: value,
            },
        }));
    };

    const handleSave = async () => {
        setError('');
        setSuccessMsg('');

        try {
            await updateSchedules({
                schedules: Object.values(localSchedules),
            });
            setSuccessMsg('Schedule updated successfully!');
        } catch (err: unknown) {
            const errorMessage =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Failed to save schedule.';
            setError(errorMessage);
        }
    };

    if (isLoading && !Object.keys(localSchedules).length) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 1, color: '#2D3748' }}>
                Working Hours
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Set your standard weekly availability and appointment slot durations.
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {successMsg && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMsg('')}>{successMsg}</Alert>}

            <Box sx={{ p: 0 }}>
                {DAYS_ORDER.map((day, index) => {
                    const rowData = localSchedules[day];
                    if (!rowData) return null;

                    return (
                        <Box key={day} sx={{ py: 2.5, borderBottom: index === DAYS_ORDER.length - 1 ? 'none' : '1px solid rgba(0,0,0,0.05)' }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <Typography variant="subtitle1" fontWeight={700} sx={{ textTransform: 'capitalize', color: '#4A5568' }}>
                                        {day}
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 5, md: 3 }}>
                                    <TextField
                                        type="time"
                                        fullWidth
                                        size="small"
                                        disabled={!rowData.isAvailable}
                                        value={rowData.startTime}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            handleChange(day, 'startTime', val.length === 5 ? `${val}:00` : val);
                                        }}
                                        slotProps={{
                                            htmlInput: { step: 300 },
                                            input: {
                                                sx: {
                                                    borderRadius: 3,
                                                    bgcolor: rowData.isAvailable ? '#F7FAFC' : 'transparent'
                                                }
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 2, md: 1 }} sx={{ textAlign: 'center' }}>
                                    <Box sx={{ width: 12, height: 2, bgcolor: 'divider', mx: 'auto' }} />
                                </Grid>

                                <Grid size={{ xs: 5, md: 3 }}>
                                    <TextField
                                        type="time"
                                        fullWidth
                                        size="small"
                                        disabled={!rowData.isAvailable}
                                        value={rowData.endTime}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            handleChange(day, 'endTime', val.length === 5 ? `${val}:00` : val);
                                        }}
                                        slotProps={{
                                            htmlInput: { step: 300 },
                                            input: {
                                                sx: {
                                                    borderRadius: 3,
                                                    bgcolor: rowData.isAvailable ? '#F7FAFC' : 'transparent'
                                                }
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 2 }} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                color="primary"
                                                checked={rowData.isAvailable}
                                                onChange={(e) => handleChange(day, 'isAvailable', e.target.checked)}
                                            />
                                        }
                                        label=""
                                        sx={{ m: 0 }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    );
                })}
            </Box>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                    variant="outlined"
                    sx={{ px: 4, py: 1, borderRadius: 3, textTransform: 'none', fontWeight: 600 }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    onClick={handleSave}
                    disabled={isLoading || isSaving}
                    sx={{
                        px: 4,
                        py: 1,
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #00BCD4 0%, #009688 100%)',
                    }}
                >
                    Save Changes
                </Button>
            </Box>
        </Box>
    );
}
