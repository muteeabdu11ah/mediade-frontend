'use client';

import React from 'react';
import { Box, Typography, Card, Avatar, Stack, Divider } from '@mui/material';
import { Star, Language, WorkHistory } from '@mui/icons-material';
import { BORDER_RADIUS, SHADOWS } from '@/lib/constants/design-tokens';

interface DoctorProfileSectionProps {
    doctor: any;
}

const DoctorProfileSection: React.FC<DoctorProfileSectionProps> = ({ doctor }) => {
    return (
        <Card sx={{ p: 3, borderRadius: BORDER_RADIUS.large, boxShadow: SHADOWS.premium, height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mb: 3 }}>
                <Avatar
                    src={doctor.profileImageUrl || ''}
                    sx={{ width: 120, height: 120, mb: 2, borderRadius: 4, bgcolor: 'rgba(0, 188, 212, 0.1)', color: '#00BCD4' }}
                >
                    {doctor.firstName?.[0]}
                </Avatar>
                <Typography variant="h5" fontWeight={700} color="#2D3748">
                    Dr. {doctor.firstName} {doctor.lastName}
                </Typography>
                <Typography variant="subtitle1" color="#00BCD4" fontWeight={600}>
                    {doctor.doctorProfile?.specialty || 'General Practitioner'}
                </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Stack spacing={2.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <WorkHistory sx={{ color: '#00BCD4', fontSize: 20 }} />
                        <Typography color="#4A5568" fontWeight={500}>Experience</Typography>
                    </Stack>
                    <Typography fontWeight={600} color="#2D3748">
                        {doctor.doctorProfile?.yearsOfExperience || 0} years
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Language sx={{ color: '#00BCD4', fontSize: 20 }} />
                        <Typography color="#4A5568" fontWeight={500}>Languages</Typography>
                    </Stack>
                    <Box sx={{ textAlign: 'right', maxWidth: '60%' }}>
                        <Typography fontWeight={600} color="#2D3748">
                            {doctor.doctorProfile?.languages?.join(', ') || 'English'}
                        </Typography>
                    </Box>
                </Box>
            </Stack>
        </Card>
    );
};

export default DoctorProfileSection;
