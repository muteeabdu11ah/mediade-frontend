import React from 'react';
import { Box, Card, CardContent, Typography, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface DateCarouselProps {
    selectedDate: Date;
    setSelectedDate: (date: Date) => void;
    appointmentsCount: number;
}

const DateCarousel: React.FC<DateCarouselProps> = ({ selectedDate, setSelectedDate, appointmentsCount }) => {
    // Generate 7 days around the selected date
    const days = Array.from({ length: 7 }).map((_, idx) => {
        const d = new Date(selectedDate);
        d.setDate(selectedDate.getDate() - 3 + idx);
        return d;
    });

    const startDate = days[0];
    const endDate = days[6];

    const formatDateRange = () => {
        const startMonth = startDate.toLocaleDateString('en-US', { month: 'long' });
        const startDay = startDate.getDate();
        const endMonth = endDate.toLocaleDateString('en-US', { month: 'long' });
        const endDay = endDate.getDate();
        const year = selectedDate.getFullYear();

        if (startMonth === endMonth) {
            return `${startMonth} ${startDay} - ${endDay}, ${year}`;
        }
        return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
    };

    return (
        <Card sx={{
            mb: 4,
            borderRadius: 4,
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            border: '1px solid #f0f0f0',
            bgcolor: 'white'
        }}>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4,
                    px: 1
                }}>
                    <IconButton
                        size="small"
                        onClick={() => {
                            const newDate = new Date(selectedDate);
                            newDate.setDate(selectedDate.getDate() - 7);
                            setSelectedDate(newDate);
                        }}
                        sx={{
                            bgcolor: '#BEE3F8',
                            color: '#3182CE',
                            borderRadius: '12px',
                            p: 1,
                            '&:hover': { bgcolor: '#90CDF4' }
                        }}
                    >
                        <ChevronLeftIcon />
                    </IconButton>

                    <Typography
                        variant="h5"
                        fontWeight={600}
                        color="#2D3748"
                        sx={{
                            fontSize: '1.5rem',
                            fontFamily: "'Inter', sans-serif"
                        }}
                    >
                        {formatDateRange()}
                    </Typography>

                    <IconButton
                        size="small"
                        onClick={() => {
                            const newDate = new Date(selectedDate);
                            newDate.setDate(selectedDate.getDate() + 7);
                            setSelectedDate(newDate);
                        }}
                        sx={{
                            bgcolor: '#BEE3F8',
                            color: '#3182CE',
                            borderRadius: '12px',
                            p: 1,
                            '&:hover': { bgcolor: '#90CDF4' }
                        }}
                    >
                        <ChevronRightIcon />
                    </IconButton>
                </Box>

                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    overflowX: 'auto',
                    pb: 1,
                    px: 0.5,
                    '&::-webkit-scrollbar': { height: 6 },
                    '&::-webkit-scrollbar-thumb': { bgcolor: '#e0e0e0', borderRadius: 3 }
                }}>
                    {days.map((d, idx) => {
                        const isSelected = d.toDateString() === selectedDate.toDateString();
                        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                        const dayNum = d.getDate();

                        return (
                            <Box
                                key={idx}
                                onClick={() => setSelectedDate(d)}
                                sx={{
                                    flex: '1 0 140px',
                                    p: '20px 10px',
                                    borderRadius: '20px',
                                    textAlign: 'center',
                                    bgcolor: isSelected ? '#F0F9FA' : '#F7FAFC',
                                    border: isSelected ? '2px solid #1fb2ba' : '2px solid transparent',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease-in-out',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1,
                                    '&:hover': {
                                        bgcolor: isSelected ? '#F0F9FA' : '#EDF2F7',
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                <Typography
                                    variant="body1"
                                    fontWeight={700}
                                    color={isSelected ? '#0f7e85' : '#4A5568'}
                                    sx={{ fontSize: '1.1rem' }}
                                >
                                    {dayName} {dayNum}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    fontWeight={500}
                                    color={isSelected ? '#1fb2ba' : '#A0AEC0'}
                                    sx={{ fontSize: '0.9rem', opacity: 0.8 }}
                                >
                                    {isSelected ? `${appointmentsCount} appointments` : '--'}
                                </Typography>
                            </Box>
                        );
                    })}
                </Box>
            </CardContent>
        </Card>
    );
};

export default DateCarousel;
