'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

import { COLORS, BORDER_RADIUS } from '@/lib/constants/design-tokens';

export type StatusPreset = 'active' | 'inactive' | 'upcoming' | 'completed' | 'cancelled' | 'missed' | 'late' | 'scheduled' | 'in_progress' | 'pending';

const presets: Record<string, { label: string; bgcolor: string; color: string; border: string }> = {
    active: {
        label: 'Active',
        bgcolor: COLORS.success.subtle,
        color: COLORS.success.main,
        border: `1px solid ${COLORS.success.main}30`,
    },
    inactive: {
        label: 'Inactive',
        bgcolor: COLORS.background.subtle,
        color: COLORS.text.muted,
        border: `1px solid ${COLORS.border.medium}`,
    },
    upcoming: {
        label: 'Upcoming',
        bgcolor: COLORS.info.subtle,
        color: COLORS.info.main,
        border: `1px solid ${COLORS.info.main}30`,
    },
    scheduled: {
        label: 'Scheduled',
        bgcolor: COLORS.info.subtle,
        color: COLORS.info.main,
        border: `1px solid ${COLORS.info.main}30`,
    },
    completed: {
        label: 'Completed',
        bgcolor: COLORS.success.subtle,
        color: COLORS.success.main,
        border: `1px solid ${COLORS.success.main}30`,
    },
    cancelled: {
        label: 'Cancelled',
        bgcolor: COLORS.error.subtle,
        color: COLORS.error.main,
        border: `1px solid ${COLORS.error.main}30`,
    },
    missed: {
        label: 'Missed',
        bgcolor: COLORS.error.subtle,
        color: COLORS.error.main,
        border: `1px solid ${COLORS.error.main}30`,
    },
    late: {
        label: 'Late',
        bgcolor: COLORS.warning.subtle,
        color: COLORS.warning.main,
        border: `1px solid ${COLORS.warning.main}30`,
    },
    in_progress: {
        label: 'In Progress',
        bgcolor: COLORS.primary.subtle,
        color: COLORS.primary.main,
        border: `1px solid ${COLORS.primary.main}30`,
    },
    pending: {
        label: 'Pending',
        bgcolor: COLORS.warning.subtle,
        color: COLORS.warning.main,
        border: `1px solid ${COLORS.warning.main}30`,
    }
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
    const chipBgcolor = bgcolor || preset?.bgcolor || COLORS.background.subtle;
    const chipColor = color || preset?.color || COLORS.text.secondary;
    const chipBorder = border || preset?.border || `1px solid ${COLORS.border.light}`;

    return (
        <Box
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: chipBgcolor,
                color: chipColor,
                border: chipBorder,
                borderRadius: BORDER_RADIUS.sm, // Using sm for a more modern "tag" look, but full if requested
                px: 1.5,
                py: 0.5,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'scale(1.02)',
                    filter: 'brightness(0.98)'
                }
            }}
        >
            <Typography
                variant="caption"
                sx={{
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontSize: '0.7rem'
                }}
            >
                {chipLabel}
            </Typography>
        </Box>
    );
}
