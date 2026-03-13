'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { COLORS, BORDER_RADIUS } from '@/lib/constants/design-tokens';

export interface BreadcrumbItem {
    label: string;
    href: string;
}

interface NestedBreadcrumbProps {
    /** Base route that acts as the root of the breadcrumb, e.g. '/dashboard/patient/appointments' */
    basePath: string;
    /** Label for the base/root segment */
    baseLabel: string;
    /** 
     * Map of URL path segments to display labels, e.g. { book: 'Book Appointment' }.
     * Any segment not in this map will be title-cased automatically.
     */
    segmentLabels?: Record<string, string>;
    /**
     * Function to resolve labels for dynamic segments (e.g. UUIDs).
     * Receives the segment string and its index in the tail.
     * Return a label string, or null to use the default title-casing.
     */
    resolveDynamicLabel?: (segment: string, index: number) => string | null;
}

function toTitleCase(str: string): string {
    return str
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function isUUID(str: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

/**
 * A reusable breadcrumb component for nested page layouts.
 * Automatically builds breadcrumb segments from the current URL path.
 * Renders nothing when on the base path (root page).
 */
export default function NestedBreadcrumb({
    basePath,
    baseLabel,
    segmentLabels = {},
    resolveDynamicLabel,
}: NestedBreadcrumbProps) {
    const pathname = usePathname();

    // Build segments from the path after basePath
    const tail = pathname.replace(basePath, '').split('/').filter(Boolean);

    // Don't render breadcrumb if we're on the root page
    if (tail.length === 0) return null;

    const segments: BreadcrumbItem[] = [
        { label: baseLabel, href: basePath },
    ];

    let cumulativePath = basePath;
    for (let i = 0; i < tail.length; i++) {
        const seg = tail[i];
        cumulativePath += `/${seg}`;

        // Resolve label: explicit map > dynamic resolver > skip UUIDs > title-case
        let label = segmentLabels[seg] || null;
        if (!label && resolveDynamicLabel) {
            label = resolveDynamicLabel(seg, i);
        }
        if (!label && isUUID(seg)) {
            // Skip adding UUID segments as separate breadcrumb items
            continue;
        }
        if (!label) {
            label = toTitleCase(seg);
        }

        segments.push({ label, href: cumulativePath });
    }

    return (
        <Box
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                border: `1px solid ${COLORS.border.light}`,
                borderRadius: BORDER_RADIUS.md,
                px: 2.5,
                py: 1,
                mb: 3,
                bgcolor: COLORS.background.paper,
            }}
        >
            {segments.map((segment, index) => {
                const isLast = index === segments.length - 1;
                return (
                    <React.Fragment key={segment.href}>
                        {index > 0 && (
                            <NavigateNextIcon
                                sx={{ fontSize: 20, color: COLORS.text.muted }}
                            />
                        )}
                        {isLast ? (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: COLORS.primary.main,
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                }}
                            >
                                {segment.label}
                            </Typography>
                        ) : (
                            <Link
                                href={segment.href}
                                style={{ textDecoration: 'none' }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: COLORS.text.secondary,
                                        fontWeight: 500,
                                        fontSize: '0.875rem',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            color: COLORS.primary.main,
                                        },
                                        transition: 'color 0.2s ease',
                                    }}
                                >
                                    {segment.label}
                                </Typography>
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </Box>
    );
}
