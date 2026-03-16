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
import { COLORS, GRADIENTS } from '@/lib/constants/design-tokens';

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
    slotDuration: 30,
});

export default function WorkingHoursTab() {
    const { schedules: serverSchedules, isLoading, updateSchedules, isSaving } = useSchedules();
    const [localSchedules, setLocalSchedules] = useState<Record<DayOfWeek, ScheduleFormData>>({} as any);
    const [globalSlotDuration, setGlobalSlotDuration] = useState<number>(30);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        if (serverSchedules && serverSchedules.length > 0) {
            const initial: Record<string, ScheduleFormData> = {};
            // Use the slot duration from the first record as the global one
            setGlobalSlotDuration(serverSchedules[0].slotDuration || 30);

            DAYS_ORDER.forEach((day) => {
                const existing = serverSchedules.find((s) => s.dayOfWeek === day);
                if (existing) {
                    initial[day] = {
                        dayOfWeek: day,
                        startTime: existing.startTime,
                        endTime: existing.endTime,
                        isAvailable: existing.isAvailable,
                        slotDuration: existing.slotDuration,
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
            // Apply global slot duration to all schedules before saving
            const schedulesToSave = Object.values(localSchedules).map(s => ({
                ...s,
                slotDuration: globalSlotDuration
            }));

            await updateSchedules({
                schedules: schedulesToSave,
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
            <Typography variant="h3" sx={{ mb: 1, color: COLORS.text.primary, fontWeight: 700 }}>
                Appointment Schedule
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Set your available hours for each day
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {successMsg && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMsg('')}>{successMsg}</Alert>}

            {/* Global Slot Duration */}
            <Box sx={{ mb: 4 }}>
                <TextField
                    label="Slot Duration"
                    type="number"
                    value={globalSlotDuration}
                    onChange={(e) => setGlobalSlotDuration(Number(e.target.value))}
                    InputProps={{
                        endAdornment: <Typography sx={{ fontWeight: 600, color: COLORS.text.secondary }}>min</Typography>,
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                            bgcolor: COLORS.background.default,
                            height: 48,
                            width: 120,
                            fontWeight: 600,
                            '& fieldset': { borderColor: '#E2E8F0' },
                            '&:hover fieldset': { borderColor: '#CBD5E1' },
                            '&.Mui-focused fieldset': { borderColor: COLORS.primary.main },
                        },
                        '& input': { textAlign: 'center' },
                        '& .MuiInputLabel-root': {
                            fontWeight: 500,
                            color: COLORS.text.secondary,
                        }
                    }}
                />
            </Box>

            {/* Schedules List */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {DAYS_ORDER.map((day) => {
                    const rowData = localSchedules[day];
                    if (!rowData) return null;

                    return (
                        <Box
                            key={day}
                            sx={{
                                py: 2,
                                px: 3,
                                borderRadius: 1,
                                bgcolor: COLORS.background.default,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                transition: 'all 0.2s',
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    textTransform: 'capitalize',
                                    color: COLORS.text.primary,
                                    fontWeight: 600,
                                    width: 120
                                }}
                            >
                                {day.toLowerCase()}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' }}>
                                <TextField
                                    type="time"
                                    size="small"
                                    disabled={!rowData.isAvailable}
                                    value={rowData.startTime}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        handleChange(day, 'startTime', val.length === 5 ? `${val}:00` : val);
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                            bgcolor: 'white',
                                            height: 44,
                                            width: 140, // Balanced width
                                            '& fieldset': { borderColor: '#E2E8F0' },
                                            '&:hover fieldset': { borderColor: '#CBD5E1' },
                                            '&.Mui-focused fieldset': { borderColor: COLORS.primary.main },
                                        },
                                        '& input': { textAlign: 'center' }
                                    }}
                                />

                                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                    to
                                </Typography>

                                <TextField
                                    type="time"
                                    size="small"
                                    disabled={!rowData.isAvailable}
                                    value={rowData.endTime}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        handleChange(day, 'endTime', val.length === 5 ? `${val}:00` : val);
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                            bgcolor: 'white',
                                            height: 44,
                                            width: 140, // Balanced width
                                            '& fieldset': { borderColor: '#E2E8F0' },
                                            '&:hover fieldset': { borderColor: '#CBD5E1' },
                                            '&.Mui-focused fieldset': { borderColor: COLORS.primary.main },
                                        },
                                        '& input': { textAlign: 'center' }
                                    }}
                                />
                            </Box>

                            <Box sx={{ width: 120, textAlign: 'right' }}>
                                <Switch
                                    color="primary"
                                    checked={rowData.isAvailable}
                                    onChange={(e) => handleChange(day, 'isAvailable', e.target.checked)}
                                    sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                            color: '#00C9AB', // Teal from image
                                            '& + .MuiSwitch-track': {
                                                backgroundColor: '#00C9AB',
                                            },
                                        },
                                    }}
                                />
                            </Box>
                        </Box>
                    );
                })}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                <Button
                    variant="contained"
                    startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    onClick={handleSave}
                    disabled={isLoading || isSaving}
                    sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 1,
                        textTransform: 'none',
                        background: GRADIENTS.primary,
                        fontWeight: 600,
                        boxShadow: '0 4px 14px 0 rgba(0, 201, 171, 0.39)',
                        '&:hover': {
                            background: GRADIENTS.primary,
                            opacity: 0.9,
                        }
                    }}
                >
                    Save
                </Button>
            </Box>
        </Box>
    );
}
