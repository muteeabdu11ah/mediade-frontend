'use client';

import React from 'react';
import { Card, Box, Typography, Avatar, Button, Stack } from '@mui/material';
import { LocalHospital, Star } from '@mui/icons-material';
import { GRADIENTS, SHADOWS, BORDER_RADIUS } from '@/lib/constants/design-tokens';

interface DoctorCardProps {
    doctor: {
        id: string;
        firstName: string;
        lastName: string;
        profileImageUrl: string | null;
        clinic?: { name: string } | null;
        doctorProfile?: { specialty: string | null } | null;
    };
    onBook: (id: string) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBook }) => {
    return (
        <Card
            sx={{
                p: 2.5,
                borderRadius: BORDER_RADIUS.large,
                boxShadow: SHADOWS.premium,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: SHADOWS.hover,
                },
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}
        >
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Avatar
                    src={doctor.profileImageUrl || ''}
                    sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 4,
                        bgcolor: 'rgba(0, 188, 212, 0.1)',
                        color: '#00BCD4',
                    }}
                >
                    {doctor.firstName[0]}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ color: '#2D3748', mb: 0.5 }}>
                        Dr. {doctor.firstName} {doctor.lastName}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                        <Box sx={{ display: 'flex', color: '#718096' }}>
                            <LocalHospital sx={{ fontSize: 16, mr: 0.5, color: '#00BCD4' }} />
                        </Box>
                        <Typography variant="body2" sx={{ color: '#718096' }}>
                            {doctor.doctorProfile?.specialty || 'General Practitioner'}
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Box sx={{ display: 'flex', color: '#718096' }}>
                            <Box component="span" sx={{ fontSize: 16, mr: 0.5, color: '#00BCD4' }}>🏥</Box>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#718096' }}>
                            {doctor.clinic?.name || 'Medical Center'}
                        </Typography>
                    </Stack>
                </Box>
            </Box>

            <Box sx={{ mt: 'auto' }}>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={() => onBook(doctor.id)}
                    sx={{
                        borderRadius: BORDER_RADIUS.medium,
                        textTransform: 'none',
                        fontWeight: 700,
                        background: GRADIENTS.primary,
                        boxShadow: 'none',
                        py: 1,
                        '&:hover': {
                            background: GRADIENTS.primary,
                            opacity: 0.9,
                        },
                    }}
                >
                    Book
                </Button>
            </Box>
        </Card>
    );
};

export default DoctorCard;
