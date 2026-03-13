'use client';

import React from 'react';
import { Grid, Box, Pagination, Typography, Card, Skeleton, Stack } from '@mui/material';
import DoctorCard from './DoctorCard';
import { BORDER_RADIUS, GRADIENTS, SHADOWS } from '@/lib/constants/design-tokens';

interface DoctorGridProps {
    doctors: any[];
    loading: boolean;
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onBook: (id: string) => void;
}

/** Mirrors DoctorCard layout exactly */
function DoctorCardSkeleton() {
    return (
        <Card
            sx={{
                p: { xs: 2, sm: 2.5 },
                borderRadius: BORDER_RADIUS.lg,
                boxShadow: SHADOWS.premium,
                border: '1px solid rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 3,
                height: '100%',
                overflow: 'hidden',
            }}
        >
            {/* Avatar / portrait shimmer */}
            <Skeleton
                variant="rectangular"
                sx={{
                    width: { xs: '100%', sm: 160 },
                    height: { xs: 200, sm: 'auto' },
                    minHeight: { sm: 180 },
                    flexShrink: 0,
                    borderRadius: 4,
                }}
            />

            {/* Content shimmer */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2 }}>
                {/* Name */}
                <Skeleton variant="text" width="70%" height={36} sx={{ borderRadius: 1 }} />

                {/* Specialty row */}
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="text" width="50%" height={22} sx={{ borderRadius: 1 }} />
                </Stack>

                {/* Clinic row */}
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="text" width="45%" height={22} sx={{ borderRadius: 1 }} />
                </Stack>

                {/* Book button */}
                <Skeleton variant="rectangular" width={100} height={44} sx={{ borderRadius: 2, mt: 1 }} />
            </Box>
        </Card>
    );
}

const DoctorGrid: React.FC<DoctorGridProps> = ({
    doctors,
    loading,
    page,
    totalPages,
    onPageChange,
    onBook,
}) => {
    if (loading) {
        return (
            <Grid container spacing={3}>
                {Array.from({ length: 6 }).map((_, i) => (
                    <Grid key={i} size={{ xs: 12, md: 12, lg: 6, xl: 4 }}>
                        <DoctorCardSkeleton />
                    </Grid>
                ))}
            </Grid>
        );
    }

    if (doctors.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 10 }}>
                <Typography variant="h3" color="textSecondary">
                    No doctors found matching your search.
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Grid container spacing={3}>
                {doctors.map((doctor) => (
                    <Grid key={doctor.id} size={{ xs: 12, md: 12, lg: 6, xl: 4 }}>
                        <DoctorCard doctor={doctor} onBook={onBook} />
                    </Grid>
                ))}
            </Grid>
            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, p) => onPageChange(p)}
                        sx={{
                            '& .MuiPaginationItem-root': {
                                borderRadius: 2,
                                '&.Mui-selected': {
                                    background: GRADIENTS.primary,
                                    color: 'white',
                                    '&:hover': { opacity: 0.9 }
                                }
                            }
                        }}
                    />
                </Box>
            )}
        </Box>
    );
};

export default DoctorGrid;
