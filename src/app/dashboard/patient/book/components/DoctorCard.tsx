'use client';

import React from 'react';
import { Card, Box, Typography, Avatar, Button, Stack } from '@mui/material';
import { MedicalServices, AddHomeWork, Star } from '@mui/icons-material';
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
                p: { xs: 2, sm: 2.5 },
                borderRadius: BORDER_RADIUS.large,
                boxShadow: SHADOWS.premium,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: SHADOWS.hover,
                },
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 3,
                height: '100%',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                position: 'relative',
                overflow: 'visible',
            }}
        >
            {/* Portrait Image/Avatar */}
            <Avatar
                src={doctor.profileImageUrl || ''}
                variant="rounded"
                sx={{
                    width: { xs: '100%', sm: 160 },
                    height: { xs: 200, sm: 'auto' },
                    flexShrink: 0,
                    borderRadius: 4,
                    bgcolor: 'rgba(0, 188, 212, 0.05)',
                    color: '#00BCD4',
                    fontSize: '3rem',
                    '& img': {
                        objectFit: 'cover'
                    }
                }}
            >
                {doctor.firstName[0]}
            </Avatar>

            {/* Content Section */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography
                    variant="h5"
                    fontWeight={800}
                    sx={{
                        color: '#2D3748',
                        mb: 2,
                        fontSize: { xs: '1.25rem', md: '1.5rem' }
                    }}
                >
                    Dr. {doctor.firstName} {doctor.lastName}
                </Typography>

                <Stack spacing={2} sx={{ mb: 3 }}>
                    {/* Specialty Row */}
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                bgcolor: 'rgba(0, 188, 212, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#00BCD4'
                            }}
                        >
                            <MedicalServices sx={{ fontSize: 20 }} />
                        </Box>
                        <Typography variant="body1" sx={{ color: '#718096', fontWeight: 500 }}>
                            {doctor.doctorProfile?.specialty || 'Cardiologist'}
                        </Typography>
                    </Stack>

                    {/* Clinic Row */}
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                bgcolor: 'rgba(0, 188, 212, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#00BCD4'
                            }}
                        >
                            <AddHomeWork sx={{ fontSize: 20 }} />
                        </Box>
                        <Typography variant="body1" sx={{ color: '#718096', fontWeight: 500 }}>
                            {doctor.clinic?.name || 'Evergreen Clinic'}
                        </Typography>
                    </Stack>
                </Stack>

                <Button
                    variant="contained"
                    onClick={() => onBook(doctor.id)}
                    sx={{
                        borderRadius: BORDER_RADIUS.medium,
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '1rem',
                        background: GRADIENTS.primary,
                        boxShadow: '0 4px 14px 0 rgba(0, 188, 212, 0.39)',
                        px: 4,
                        py: 1.5,
                        width: 'fit-content',
                        '&:hover': {
                            background: GRADIENTS.primary,
                            opacity: 0.9,
                            boxShadow: '0 6px 20px rgba(0, 188, 212, 0.23)',
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
