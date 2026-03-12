'use client';

import { Box, Card, CardContent, Typography, IconButton, Badge, useTheme, useMediaQuery } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface CalendarWeeklyProps {
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
    onNavigate: (date: Date) => void;
    stats: Record<string, number>;
}

const CalendarWeekly: React.FC<CalendarWeeklyProps> = ({ selectedDate, onDateSelect, onNavigate, stats }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Helper to get the start of the week (Sunday)
    const getStartOfWeek = (date: Date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day;
        return new Date(d.setDate(diff));
    };

    const startOfWeek = getStartOfWeek(selectedDate);

    // Generate 7 days for the week
    const days = Array.from({ length: 7 }).map((_, idx) => {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + idx);
        return d;
    });

    const formatDateRange = () => {
        const start = days[0];
        const end = days[6];
        const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
        return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}, ${selectedDate.getFullYear()}`;
    };

    const handleNavigate = (weeks: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + weeks * 7);
        onNavigate(newDate);
    };

    return (
        <Card sx={{
            mb: 4,
            borderRadius: { xs: 2, sm: 4 },
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            border: '1px solid #f0f0f0',
            bgcolor: 'white'
        }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
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

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        color="#2D3748"
                        sx={{
                            fontSize: { xs: '0.9rem', sm: '1.25rem' },
                            textAlign: 'center',
                            px: 4
                        }}
                    >
                        {formatDateRange()}
                    </Typography>

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

                <Box sx={{
                    display: 'flex',
                    gap: { xs: 0.5, sm: 2 },
                    justifyContent: 'space-between',
                }}>
                    {days.map((d, idx) => {
                        const formatDateKey = (date: Date) => {
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const day = String(date.getDate()).padStart(2, '0');
                            return `${year}-${month}-${day}`;
                        };
                        const dateStr = formatDateKey(d);
                        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                        const dayNum = d.getDate();
                        const count = stats[dateStr] || 0;
                        const isSelected = dateStr === formatDateKey(selectedDate);

                        return (
                            <Box
                                key={idx}
                                onClick={() => onDateSelect(d)}
                                sx={{
                                    flex: 1,
                                    p: { xs: '10px 4px', sm: '20px 10px' },
                                    borderRadius: { xs: '12px', sm: '20px' },
                                    textAlign: 'center',
                                    bgcolor: isSelected ? 'white' : '#F7FAFC',
                                    border: isSelected ? '1px solid #00BCD4' : '1px solid transparent',
                                    boxShadow: isSelected ? '0 4px 12px rgba(0, 188, 212, 0.15)' : 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: { xs: 0.2, sm: 0.5 },
                                    minWidth: 0, // Allow shrinking
                                    '&:hover': {
                                        bgcolor: isSelected ? 'white' : '#EDF2F7',
                                        transform: isSelected ? 'none' : 'translateY(-2px)'
                                    }
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    fontWeight={500}
                                    color="#718096"
                                    sx={{ fontSize: { xs: '0.65rem', sm: '0.875rem' } }}
                                >
                                    {dayName.toUpperCase()}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.2, sm: 0.5 } }}>
                                    <Typography
                                        variant="body1"
                                        fontWeight={700}
                                        color="#2D3748"
                                        sx={{ fontSize: { xs: '0.9rem', sm: '1.25rem' } }}
                                    >
                                        {dayNum}
                                    </Typography>
                                    {count > 0 && (
                                        <Box sx={{
                                            bgcolor: '#00BCD4',
                                            color: 'white',
                                            borderRadius: '50%',
                                            width: { xs: 14, sm: 18 },
                                            height: { xs: 14, sm: 18 },
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: { xs: '0.55rem', sm: '0.65rem' },
                                            fontWeight: 700
                                        }}>
                                            {count}
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            </CardContent>
        </Card>
    );
};

export default CalendarWeekly;
