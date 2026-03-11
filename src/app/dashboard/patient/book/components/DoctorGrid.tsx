'use client';

import React from 'react';
import { Grid, Box, Pagination, Typography, CircularProgress } from '@mui/material';
import DoctorCard from './DoctorCard';

interface DoctorGridProps {
    doctors: any[];
    loading: boolean;
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onBook: (id: string) => void;
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
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress sx={{ color: '#00BCD4' }} />
            </Box>
        );
    }

    if (doctors.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 10 }}>
                <Typography variant="h6" color="textSecondary">
                    No doctors found matching your search.
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Grid container spacing={3}>
                {doctors.map((doctor) => (
                    <Grid key={doctor.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
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
                                    background: 'linear-gradient(135deg, #00BCD4 0%, #009688 100%)',
                                    color: 'white',
                                    '&:hover': {
                                        opacity: 0.9,
                                    }
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
