import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, IconButton, Menu, MenuItem, Stack, useTheme, useMediaQuery } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

interface CalendarMonthlyProps {
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
    onNavigate: (date: Date) => void;
    stats: Record<string, number>;
}

const CalendarMonthly: React.FC<CalendarMonthlyProps> = ({ selectedDate, onDateSelect, onNavigate, stats }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);

    // Get the start of the grid (including days from previous month to fill the first row)
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(1 - firstDayOfMonth.getDay());

    // Generate weeks until we cover the whole month
    const days: Date[] = [];
    let current = new Date(startDate);

    // We want 6 rows fixed for consistency
    for (let i = 0; i < 42; i++) {
        days.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }

    const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const handleNavigate = (monthsDiff: number) => {
        const newDate = new Date(year, month + monthsDiff, 1);
        onNavigate(newDate);
    };

    const handleMonthClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMonthSelect = (monthIdx: number) => {
        const newDate = new Date(year, monthIdx, 1);
        onNavigate(newDate);
        setAnchorEl(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Card sx={{
            mb: 4,
            borderRadius: { xs: 2, sm: 4 },
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            border: '1px solid #f0f0f0',
            bgcolor: 'white'
        }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 3 } }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    mb: { xs: 2, sm: 4 },
                }}>
                    <IconButton
                        onClick={() => handleNavigate(-1)}
                        sx={{
                            position: 'absolute',
                            left: 0,
                            bgcolor: '#F7FAFC',
                            borderRadius: '12px',
                            p: { xs: 0.5, sm: 1 },
                            border: '1px solid #E2E8F0',
                            '&:hover': { bgcolor: '#EDF2F7' }
                        }}
                    >
                        <ChevronLeftIcon fontSize={isMobile ? 'small' : 'medium'} />
                    </IconButton>

                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        component="button"
                        onClick={handleMonthClick as any}
                        sx={{
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            p: 1,
                            borderRadius: 2,
                            maxWidth: '60%',
                            '&:hover': { bgcolor: '#F7FAFC' }
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight={600}
                            color="#2D3748"
                            sx={{ fontSize: { xs: '0.9rem', sm: '1.25rem' }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        >
                            {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </Typography>
                        <CalendarMonthIcon sx={{ color: '#00BCD4', fontSize: { xs: 18, sm: 20 } }} />
                    </Stack>

                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                            sx: {
                                mt: 1,
                                borderRadius: 3,
                                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                                minWidth: { xs: 160, sm: 200 },
                                maxHeight: 300
                            }
                        }}
                    >
                        <Box sx={{ p: 1.5, borderBottom: '1px solid #F0F0F0', mb: 1 }}>
                            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ px: 1 }}>
                                SELECT MONTH
                            </Typography>
                        </Box>
                        {months.map((m, idx) => (
                            <MenuItem
                                key={m}
                                onClick={() => handleMonthSelect(idx)}
                                selected={idx === month}
                                sx={{
                                    mx: 1,
                                    borderRadius: 1.5,
                                    fontSize: '0.875rem',
                                    fontWeight: idx === month ? 700 : 500,
                                    color: idx === month ? '#00BCD4' : 'inherit',
                                    '&.Mui-selected': {
                                        bgcolor: '#EBF8FB',
                                        '&:hover': { bgcolor: '#DEF2F7' }
                                    }
                                }}
                            >
                                {m}
                            </MenuItem>
                        ))}
                    </Menu>

                    <IconButton
                        onClick={() => handleNavigate(1)}
                        sx={{
                            position: 'absolute',
                            right: 0,
                            bgcolor: '#F7FAFC',
                            borderRadius: '12px',
                            p: { xs: 0.5, sm: 1 },
                            border: '1px solid #E2E8F0',
                            '&:hover': { bgcolor: '#EDF2F7' }
                        }}
                    >
                        <ChevronRightIcon fontSize={isMobile ? 'small' : 'medium'} />
                    </IconButton>
                </Box>

                <Box sx={{ border: '1px solid #EDF2F7', borderRadius: 2, overflow: 'hidden' }}>
                    {/* Header */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', bgcolor: '#EBF8FB' }}>
                        {weekdays.map(day => (
                            <Box key={day} sx={{ p: { xs: 0.8, sm: 1.5 }, textAlign: 'center', borderRight: '1px solid #EDF2F7' }}>
                                <Typography variant="caption" fontWeight={700} color="#3182CE" sx={{ fontSize: { xs: '0.6rem', sm: '0.75rem' } }}>
                                    {isMobile ? day.charAt(0) : day}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    {/* Grid */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                        {days.map((d, idx) => {
                            const formatDateKey = (date: Date) => {
                                const y = date.getFullYear();
                                const m = String(date.getMonth() + 1).padStart(2, '0');
                                const day = String(date.getDate()).padStart(2, '0');
                                return `${y}-${m}-${day}`;
                            };
                            const dateStr = formatDateKey(d);
                            const count = stats[dateStr] || 0;
                            const isCurrentMonth = d.getMonth() === month;
                            const isToday = d.toDateString() === new Date().toDateString();
                            const isSelected = dateStr === formatDateKey(selectedDate);

                            return (
                                <Box
                                    key={idx}
                                    onClick={() => onDateSelect(d)}
                                    sx={{
                                        minHeight: { xs: 60, sm: 100, md: 140 },
                                        p: { xs: 0.5, sm: 1.5 },
                                        borderRight: '1px solid #EDF2F7',
                                        borderBottom: '1px solid #EDF2F7',
                                        bgcolor: isCurrentMonth ? 'white' : '#F7FAFC',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s',
                                        '&:hover': { bgcolor: '#F0F9FA' },
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: { xs: 0.5, sm: 1.5 },
                                        position: 'relative'
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        fontWeight={isToday ? 700 : 500}
                                        color={isCurrentMonth ? (isToday ? '#00BCD4' : '#4A5568') : '#CBD5E0'}
                                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                    >
                                        {d.getDate()}
                                    </Typography>

                                    {count > 0 && (
                                        isMobile ? (
                                            <Box sx={{
                                                position: 'absolute',
                                                bottom: 4,
                                                right: 4,
                                                bgcolor: '#00BCD4',
                                                color: 'white',
                                                borderRadius: '50%',
                                                width: 16,
                                                height: 16,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.6rem',
                                                fontWeight: 700
                                            }}>
                                                {count}
                                            </Box>
                                        ) : (
                                            <Box sx={{
                                                mt: 'auto',
                                                bgcolor: '#00BCD4',
                                                color: 'white',
                                                borderRadius: 1,
                                                p: 0.5,
                                                textAlign: 'center',
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                boxShadow: '0 2px 4px rgba(0, 188, 212, 0.2)',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {count} Appointment{count > 1 ? 's' : ''}
                                            </Box>
                                        )
                                    )}
                                </Box>
                            );
                        })}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default CalendarMonthly;
