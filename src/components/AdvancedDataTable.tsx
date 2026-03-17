'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Pagination,
    Select,
    MenuItem,
    Popover,
    MenuList,
    ListItemIcon,
    ListItemText,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { COLORS, BORDER_RADIUS, SHADOWS } from '@/lib/constants/design-tokens';
import { DataTableFilters } from './DataTable/DataTableFilters';
import { DataTableContent } from './DataTable/DataTableContent';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ColumnDef<T> {
    header: string;
    accessor?: keyof T;
    render?: (row: T) => React.ReactNode;
    align?: 'left' | 'center' | 'right';
    minWidth?: number;
}

export interface ActionDef<T> {
    label: string;
    icon?: React.ReactNode;
    onClick: (row: T) => void;
    color?: 'inherit' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

export interface DataTablePagination {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export interface AdvancedDataTableProps<T> {
    columns: ColumnDef<T>[];
    data: T[];
    isLoading: boolean;
    emptyMessage?: string;
    pagination?: DataTablePagination;
    rowKey: (row: T) => string;

    // Top Bar Features
    onSearch?: (term: string) => void;
    searchPlaceholder?: string;

    // Status Filter Option
    statusOptions?: { value: string; label: string }[];
    statusValue?: string;
    onStatusChange?: (value: string) => void;

    // Date Filters
    onDateChange?: (date?: string) => void;

    // Actions
    actions?: ActionDef<T>[];
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function AdvancedDataTable<T>({
    columns,
    data,
    isLoading,
    emptyMessage = 'No data found.',
    pagination,
    rowKey,
    onSearch,
    searchPlaceholder = 'Search...',
    statusOptions,
    statusValue = 'all',
    onStatusChange,
    onDateChange,
    actions,
}: AdvancedDataTableProps<T>) {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Actions Menu State
    const [anchorEl, setAnchorEl] = useState<{ element: HTMLElement; row: T } | null>(null);

    const handleActionClick = (event: React.MouseEvent<HTMLElement>, row: T) => {
        setAnchorEl({ element: event.currentTarget, row });
    };

    const handleCloseActionMenu = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{
            width: '100%',
            bgcolor: COLORS.background.paper,
            borderRadius: BORDER_RADIUS.lg,
            p: 4,
            border: `1px solid ${COLORS.border.light}`,
            boxShadow: SHADOWS.small
        }}>
            {/* Top Action Bar */}
            <DataTableFilters
                onSearch={onSearch}
                searchPlaceholder={searchPlaceholder}
                statusOptions={statusOptions}
                statusValue={statusValue}
                onStatusChange={onStatusChange}
                onDateChange={onDateChange}
            />

            {/* Table Area */}
            <DataTableContent
                columns={columns}
                data={data}
                isLoading={isLoading}
                emptyMessage={emptyMessage}
                rowKey={rowKey}
                actions={actions}
                onActionClick={handleActionClick}
            />

            {/* Actions Popover Menu */}
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl?.element}
                onClose={handleCloseActionMenu}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: {
                        mt: 1,
                        boxShadow: SHADOWS.premium,
                        borderRadius: BORDER_RADIUS.md,
                        minWidth: 190,
                        border: `1px solid ${COLORS.border.light}`,
                        overflow: 'hidden'
                    }
                }}
            >
                <MenuList sx={{ p: 1 }}>
                    {actions?.map((action, i) => (
                        <MenuItem
                            key={i}
                            onClick={() => {
                                if (anchorEl?.row) {
                                    action.onClick(anchorEl.row);
                                }
                                handleCloseActionMenu();
                            }}
                            sx={{
                                color: action.color === 'error' ? COLORS.error.main : COLORS.text.secondary,
                                py: 1.5,
                                px: 2,
                                borderRadius: BORDER_RADIUS.sm,
                                transition: 'all 0.2s',
                                '&:hover': {
                                    bgcolor: action.color === 'error' ? COLORS.error.subtle : COLORS.primary.subtle,
                                    color: action.color === 'error' ? COLORS.error.main : COLORS.primary.main,
                                }
                            }}
                        >
                            {action.icon && (
                                <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>
                                    {React.cloneElement(action.icon as React.ReactElement)}
                                </ListItemIcon>
                            )}
                            <ListItemText primary={action.label} primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }} />
                        </MenuItem>
                    ))}
                </MenuList>
            </Popover>

            {/* Pagination Footer */}
            {pagination && pagination.totalPages > 1 && (
                <Box
                    sx={{
                        display: 'flex',
                        bgcolor: COLORS.background.paper,
                        borderRadius: BORDER_RADIUS.md,
                        border: `1px solid ${COLORS.border.light}`,
                        px: 4,
                        py: 2.5,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 3,
                        boxShadow: SHADOWS.small
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography variant="body2" color={COLORS.text.muted}>
                            Jump to page:
                        </Typography>
                        <Select
                            size="small"
                            value={String(pagination.page)}
                            onChange={(e) => pagination.onPageChange(Number(e.target.value))}
                            sx={{
                                borderRadius: BORDER_RADIUS.sm,
                                bgcolor: COLORS.background.subtle,
                                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                fontWeight: 700,
                                color: COLORS.text.primary,
                                minWidth: 80,
                                height: 36
                            }}
                        >
                            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(num => (
                                <MenuItem key={num} value={String(num)}>{num}</MenuItem>
                            ))}
                        </Select>
                        <Typography variant="body2" color={COLORS.text.muted}>
                            of {pagination.totalPages}
                        </Typography>
                    </Box>

                    <Pagination
                        count={pagination.totalPages}
                        page={pagination.page}
                        onChange={(_, val) => pagination.onPageChange(val)}
                        color="primary"
                        shape="rounded"
                        size={isMobile ? 'small' : 'medium'}
                        showFirstButton={!isMobile}
                        showLastButton={!isMobile}
                        sx={{
                            '& .MuiPaginationItem-root': {
                                fontWeight: 700,
                                borderRadius: BORDER_RADIUS.sm
                            }
                        }}
                    />
                </Box>
            )}
        </Box>
    );
}
