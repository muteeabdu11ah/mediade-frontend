'use client';

import React from 'react';
import { Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

// ─── Preset Configurations ─────────────────────────────────────────────────

type StatusPreset = 'active' | 'inactive' | 'upcoming' | 'completed' | 'cancelled' | 'missed';

const presets: Record<StatusPreset, { label: string; bgcolor: string; color: string; icon?: React.ReactElement }> = {
    active: {
        label: 'Active',
        bgcolor: 'rgba(76, 175, 80, 0.1)',
        color: '#4CAF50',
        icon: <CheckCircleIcon fontSize="small" />,
    },
    inactive: {
        label: 'Inactive',
        bgcolor: 'rgba(239, 83, 80, 0.1)',
        color: '#EF5350',
        icon: <BlockIcon fontSize="small" />,
    },
    upcoming: {
        label: 'Upcoming',
        bgcolor: 'rgba(66, 165, 245, 0.1)',
        color: '#42A5F5',
        icon: <ScheduleIcon fontSize="small" />,
    },
    completed: {
        label: 'Completed',
        bgcolor: 'rgba(102, 187, 106, 0.1)',
        color: '#66BB6A',
        icon: <CheckCircleIcon fontSize="small" />,
    },
    cancelled: {
        label: 'Cancelled',
        bgcolor: 'rgba(239, 83, 80, 0.1)',
        color: '#EF5350',
        icon: <CancelIcon fontSize="small" />,
    },
    missed: {
        label: 'Missed',
        bgcolor: 'rgba(171, 71, 188, 0.1)',
        color: '#AB47BC',
        icon: <HelpOutlineIcon fontSize="small" />,
    },
};

// ─── Props ──────────────────────────────────────────────────────────────────

interface StatusChipProps {
    /** Use a preset or provide a custom label + color. */
    status: StatusPreset | string;
    label?: string;
    bgcolor?: string;
    color?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function StatusChip({ status, label, bgcolor, color }: StatusChipProps) {
    const preset = presets[status as StatusPreset];

    const chipLabel = label || preset?.label || status;
    const chipBgcolor = bgcolor || preset?.bgcolor || 'rgba(0,0,0,0.05)';
    const chipColor = color || preset?.color || 'text.secondary';
    const chipIcon = preset?.icon;

    return (
        <Chip
            label={chipLabel}
            size="small"
            icon={chipIcon}
            sx={{
                bgcolor: chipBgcolor,
                color: chipColor,
                fontWeight: 700,
                fontSize: '0.7rem',
                borderRadius: 1,
                '& .MuiChip-icon': { color: 'inherit' },
            }}
        />
    );
}
