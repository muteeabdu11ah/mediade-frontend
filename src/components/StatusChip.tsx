'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

// ─── Preset Configurations ─────────────────────────────────────────────────

export type StatusPreset = 'active' | 'inactive' | 'upcoming' | 'completed' | 'cancelled' | 'missed' | 'late';

const presets: Record<StatusPreset, { label: string; bgcolor: string; color: string; border: string }> = {
    active: {
        label: 'Active',
        bgcolor: '#E8F5E9',
        color: '#4CAF50',
        border: '1px solid #C8E6C9',
    },
    inactive: {
        label: 'Inactive',
        bgcolor: '#FFEBEE',
        color: '#EF5350',
        border: '1px solid #FFCDD2',
    },
    upcoming: {
        label: 'Upcoming',
        bgcolor: '#E3F2FD',
        color: '#42A5F5',
        border: '1px solid #BBDEFB',
    },
    completed: {
        label: 'Completed',
        bgcolor: '#E8F5E9',
        color: '#66BB6A',
        border: '1px solid #C8E6C9',
    },
    cancelled: {
        label: 'Cancelled',
        bgcolor: '#FFEBEE',
        color: '#EF5350',
        border: '1px solid #FFCDD2',
    },
    missed: {
        label: 'Missed',
        bgcolor: '#FFF3E0',
        color: '#FFA726',
        border: '1px solid #FFE0B2',
    },
    late: {
        label: 'Late',
        bgcolor: '#FFF3E0',
        color: '#FFA726',
        border: '1px solid #FFE0B2',
    },
};

// ─── Props ──────────────────────────────────────────────────────────────────

interface StatusChipProps {
    status: StatusPreset | string;
    label?: string;
    bgcolor?: string;
    color?: string;
    border?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function StatusChip({ status, label, bgcolor, color, border }: StatusChipProps) {
    // Normalize status string to lowercase for preset matching
    const normalizedStatus = status.toLowerCase() as StatusPreset;
    const preset = presets[normalizedStatus];

    const chipLabel = label || preset?.label || status;
    const chipBgcolor = bgcolor || preset?.bgcolor || 'rgba(0,0,0,0.05)';
    const chipColor = color || preset?.color || 'text.secondary';
    const chipBorder = border || preset?.border || '1px solid rgba(0,0,0,0.1)';

    return (
        <Box
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: chipBgcolor,
                color: chipColor,
                border: chipBorder,
                borderRadius: '16px',
                px: 1.5,
                py: 0.5,
            }}
        >
            <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                {chipLabel}
            </Typography>
        </Box>
    );
}
