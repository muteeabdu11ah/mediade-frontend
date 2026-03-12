'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { GRADIENTS, COLORS, BORDER_RADIUS, SHADOWS } from '@/lib/constants/design-tokens';

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
                mb: 6,
                flexWrap: 'wrap',
                gap: 2
            }}
        >
            <Box>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 900,
                        color: COLORS.text.primary,
                        letterSpacing: '-1.5px',
                        fontSize: { xs: '1.75rem', md: '2.25rem' }
                    }}
                >
                    {title}
                </Typography>
                {subtitle && (
                    <Typography
                        variant="body1"
                        sx={{
                            color: COLORS.text.muted,
                            mt: 1,
                            fontWeight: 600,
                            maxWidth: 500
                        }}
                    >
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
                        borderRadius: BORDER_RADIUS.full,
                        px: 4,
                        py: 1.5,
                        fontWeight: 800,
                        background: GRADIENTS.primary,
                        boxShadow: SHADOWS.medium,
                        letterSpacing: '0.5px',
                        '&:hover': {
                            background: GRADIENTS.hover,
                            boxShadow: SHADOWS.hover,
                            transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.3s ease'
                    }}
                >
                    {actionLabel}
                </Button>
            )}
        </Box>
    );
}

