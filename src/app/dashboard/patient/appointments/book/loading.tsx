'use client';

import React from 'react';
import { Box, Skeleton, Grid, Container } from '@mui/material';
import { BORDER_RADIUS } from '@/lib/constants/design-tokens';

export default function Loading() {
    return (
        <Box sx={{ p: 4 }}>
            {/* Breadcrumbs Skeleton */}
            <Skeleton width={200} height={24} sx={{ mb: 4 }} />

            {/* Title Skeleton */}
            <Skeleton width="40%" height={60} sx={{ mb: 1 }} />
            <Skeleton width="60%" height={24} sx={{ mb: 6 }} />

            {/* Filter Skeleton */}
            <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
                <Skeleton width={300} height={56} sx={{ borderRadius: BORDER_RADIUS.md }} />
                <Skeleton width={200} height={56} sx={{ borderRadius: BORDER_RADIUS.md }} />
            </Box>

            {/* Doctor Grid Skeleton */}
            <Grid container spacing={3}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                        <Skeleton
                            variant="rectangular"
                            height={300}
                            sx={{ borderRadius: BORDER_RADIUS.lg }}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
