'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, Grid, Button, IconButton, Stack, CircularProgress } from '@mui/material';
import { ChevronLeft, ChevronRight, CheckCircle } from '@mui/icons-material';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, isBefore, startOfDay } from 'date-fns';
import { BORDER_RADIUS, SHADOWS, GRADIENTS } from '@/lib/constants/design-tokens';
import api from '@/lib/api';

interface SlotPickerProps {
    doctorId: string;
    onSlotSelect: (date: string, time: string) => void;
}

const SlotPicker: React.FC<SlotPickerProps> = ({ doctorId, onSlotSelect }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [slots, setSlots] = useState<string[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

    useEffect(() => {
        const fetchSlots = async () => {
            setLoadingSlots(true);
            try {
                const dateStr = format(selectedDate, 'yyyy-MM-dd');
                const res = await api.get(`/appointments/slots?doctorId=${doctorId}&date=${dateStr}`);
                setSlots(res.data);
                setSelectedSlot(null);
            } catch (err) {
                console.error('Failed to fetch slots', err);
                setSlots([]);
            } finally {
                setLoadingSlots(false);
            }
        };

        fetchSlots();
    }, [doctorId, selectedDate]);

    const renderHeader = () => {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <IconButton onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                    <ChevronLeft />
                </IconButton>
                <Typography variant="h3" fontWeight={700} color="#2D3748">
                    {format(currentMonth, 'MMMM yyyy')}
                </Typography>
                <IconButton onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                    <ChevronRight />
                </IconButton>
            </Box>
        );
    };

    const renderDays = () => {
        const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        return (
            <Grid container spacing={1} sx={{ mb: 1 }}>
                {days.map((day, i) => (
                    <Grid size={1.7} key={i}>
                        <Typography variant="caption" fontWeight={600} color="#718096" display="block" align="center">
                            {day}
                        </Typography>
                    </Grid>
                ))}
            </Grid>
        );
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, "d");
                const cloneDay = day;
                const isSelected = isSameDay(day, selectedDate);
                const isDisabled = !isSameMonth(day, monthStart) || isBefore(day, startOfDay(new Date()));

                days.push(
                    <Grid size={1.7} key={day.toString()}>
                        <Box
                            onClick={() => !isDisabled && setSelectedDate(cloneDay)}
                            sx={{
                                height: 40,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: isDisabled ? 'default' : 'pointer',
                                borderRadius: 2,
                                transition: 'all 0.2s',
                                bgcolor: isSelected ? '#00BCD4' : 'transparent',
                                color: isSelected ? 'white' : isDisabled ? '#CBD5E0' : '#2D3748',
                                fontWeight: isSelected ? 700 : 500,
                                '&:hover': {
                                    bgcolor: isSelected ? '#00BCD4' : isDisabled ? 'transparent' : 'rgba(0, 188, 212, 0.1)',
                                }
                            }}
                        >
                            {formattedDate}
                        </Box>
                    </Grid>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <Grid container spacing={1} key={day.toString()}>
                    {days}
                </Grid>
            );
            days = [];
        }
        return <Box>{rows}</Box>;
    };

    return (
        <Card sx={{ p: 3, borderRadius: BORDER_RADIUS.large, boxShadow: SHADOWS.premium, height: '100%' }}>
            <Typography variant="h3" fontWeight={700} color="#2D3748" sx={{ mb: 3 }}>
                Select Date & Time
            </Typography>

            <Box sx={{ maxWidth: 400, mx: 'auto', mb: 4 }}>
                {renderHeader()}
                {renderDays()}
                {renderCells()}
            </Box>

            <Box sx={{ pt: 3, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                <Typography variant="subtitle1" fontWeight={700} color="#2D3748" sx={{ mb: 2 }}>
                    Available Slots
                </Typography>

                {loadingSlots ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                        <CircularProgress size={24} sx={{ color: '#00BCD4' }} />
                    </Box>
                ) : slots.length === 0 ? (
                    <Typography color="textSecondary" variant="body2">
                        No available slots for the selected date.
                    </Typography>
                ) : (
                    <Grid container spacing={2}>
                        {slots.map((slot) => (
                            <Grid size={{ xs: 4, sm: 3, md: 2.4 }} key={slot}>
                                <Button
                                    fullWidth
                                    variant={selectedSlot === slot ? 'contained' : 'outlined'}
                                    onClick={() => setSelectedSlot(slot)}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        py: 1,
                                        transition: 'all 0.2s',
                                        ...(selectedSlot === slot ? {
                                            background: GRADIENTS.primary,
                                            borderColor: 'transparent',
                                            '&:hover': { background: GRADIENTS.primary, opacity: 0.9 }
                                        } : {
                                            borderColor: '#E2E8F0',
                                            color: '#4A5568',
                                            '&:hover': { borderColor: '#00BCD4', color: '#00BCD4', bgcolor: 'rgba(0,188,212,0.05)' }
                                        })
                                    }}
                                >
                                    {slot.substring(0, 5)}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    disabled={!selectedSlot}
                    onClick={() => onSlotSelect(format(selectedDate, 'yyyy-MM-dd'), selectedSlot as string)}
                    startIcon={<CheckCircle />}
                    sx={{
                        borderRadius: BORDER_RADIUS.medium,
                        background: GRADIENTS.primary,
                        textTransform: 'none',
                        px: 4,
                        py: 1.2,
                        fontWeight: 700,
                        '&:hover': { background: GRADIENTS.primary, opacity: 0.9 }
                    }}
                >
                    Proceed
                </Button>
            </Box>
        </Card>
    );
};

export default SlotPicker;
