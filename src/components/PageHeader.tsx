'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    actionLabel?: string;
    onAction?: () => void;
    actionIcon?: React.ReactNode;
}

export default function PageHeader({
    title,
    subtitle,
    actionLabel,
    onAction,
    actionIcon,
}: PageHeaderProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 4,
            }}
        >
            <Box>
                <Typography variant="h5" fontWeight={700} sx={{ color: '#1A2B3C' }}>
                    {title}
                </Typography>
                {subtitle && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {subtitle}
                    </Typography>
                )}
            </Box>
            {actionLabel && onAction && (
                <Button
                    variant="contained"
                    startIcon={actionIcon || <AddIcon />}
                    onClick={onAction}
                    sx={{
                        bgcolor: '#2EC2C9',
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        fontWeight: 700,
                        '&:hover': { bgcolor: '#24B1B8' },
                    }}
                >
                    {actionLabel}
                </Button>
            )}
        </Box>
    );
}
