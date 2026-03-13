'use client';

import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Typography,
    Pagination,
    InputBase,
    IconButton,
    Select,
    MenuItem,
    SelectChangeEvent,
    Popover,
    MenuList,
    ListItemIcon,
    ListItemText,
    Skeleton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { COLORS, BORDER_RADIUS, SHADOWS, TYPOGRAPHY } from '@/lib/constants/design-tokens';

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
    onDateChange?: (start?: string, end?: string) => void;

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

    // Actions Menu State
    const [anchorEl, setAnchorEl] = useState<{ element: HTMLElement; row: T } | null>(null);

    // Date Filter Type State
    const [dateFilterType, setDateFilterType] = useState<'Date' | 'Date Range'>('Date');

    const handleActionClick = (event: React.MouseEvent<HTMLElement>, row: T) => {
        setAnchorEl({ element: event.currentTarget, row });
    };

    const handleCloseActionMenu = () => {
        setAnchorEl(null);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onSearch) {
            onSearch(e.target.value);
        }
    };

    const handleStatusChange = (e: SelectChangeEvent<string>) => {
        if (onStatusChange) {
            onStatusChange(e.target.value);
        }
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
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'stretch', md: 'center' },
                    mb: 4,
                    gap: 3,
                }}
            >
                {/* Search Input */}
                {onSearch !== undefined && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            bgcolor: COLORS.background.default,
                            border: `1px solid ${COLORS.border.medium}`,
                            borderRadius: BORDER_RADIUS.full,
                            px: 3,
                            py: 0.8,
                            flex: 1,
                            maxWidth: { xs: '100%', md: '450px' },
                            transition: 'all 0.2s ease',
                            '&:focus-within': {
                                borderColor: COLORS.primary.main,
                                boxShadow: `0 0 0 4px ${COLORS.primary.subtle}`,
                                bgcolor: COLORS.background.paper
                            }
                        }}
                    >
                        <SearchIcon sx={{ color: COLORS.text.muted, mr: 1.5, fontSize: 22 }} />
                        <InputBase
                            placeholder={searchPlaceholder}
                            onChange={handleSearchChange}
                            sx={{
                                flex: 1,
                                fontSize: '0.95rem',
                                fontWeight: 500,
                                color: COLORS.text.primary,
                                '& input::placeholder': {
                                    color: COLORS.text.muted,
                                    opacity: 1
                                }
                            }}
                        />
                    </Box>
                )}

                {/* Filters */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', ml: 'auto' }}>
                    {statusOptions && onStatusChange && (
                        <Select
                            value={statusValue}
                            onChange={handleStatusChange}
                            size="small"
                            displayEmpty
                            sx={{
                                bgcolor: COLORS.background.default,
                                borderRadius: BORDER_RADIUS.full,
                                border: `1px solid ${COLORS.border.medium}`,
                                '& .MuiOutlinedInput-notchedOutline': {
                                    border: 'none',
                                },
                                minWidth: 140,
                                height: 44,
                                '& .MuiSelect-select': {
                                    py: 0,
                                    pl: 3,
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    color: COLORS.text.secondary,
                                }
                            }}
                        >
                            <MenuItem value="all"><em>All Status</em></MenuItem>
                            {statusOptions.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </MenuItem>
                            ))}
                        </Select>
                    )}

                    {/* Date Filters (Dropdown + Inputs) */}
                    {onDateChange !== undefined && (
                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                            <Select
                                value={dateFilterType}
                                onChange={(e) => setDateFilterType(e.target.value as 'Date' | 'Date Range')}
                                size="small"
                                sx={{
                                    bgcolor: COLORS.background.default,
                                    borderRadius: BORDER_RADIUS.full,
                                    border: `1px solid ${COLORS.border.medium}`,
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        border: 'none',
                                    },
                                    minWidth: 110,
                                    height: 44,
                                    '& .MuiSelect-select': {
                                        py: 0,
                                        pl: 3,
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        color: COLORS.text.secondary,
                                    }
                                }}
                            >
                                <MenuItem value="Date">Date</MenuItem>
                                <MenuItem value="Date Range">Date Range</MenuItem>
                            </Select>

                            {dateFilterType === 'Date' ? (
                                <input
                                    type="date"
                                    style={{
                                        padding: '0 20px',
                                        borderRadius: BORDER_RADIUS.full,
                                        border: `1px solid ${COLORS.border.medium}`,
                                        outline: 'none',
                                        color: COLORS.text.primary,
                                        backgroundColor: COLORS.background.default,
                                        fontFamily: 'inherit',
                                        fontSize: '0.9rem',
                                        fontWeight: 500,
                                        height: '44px',
                                        boxSizing: 'border-box'
                                    }}
                                    onChange={(e) => onDateChange(e.target.value, e.target.value)}
                                />
                            ) : (
                                <>
                                    <input
                                        type="date"
                                        style={{
                                            padding: '0 20px',
                                            borderRadius: BORDER_RADIUS.full,
                                            border: `1px solid ${COLORS.border.medium}`,
                                            outline: 'none',
                                            color: COLORS.text.primary,
                                            backgroundColor: COLORS.background.default,
                                            fontFamily: 'inherit',
                                            fontSize: '0.9rem',
                                            fontWeight: 500,
                                            height: '44px',
                                            boxSizing: 'border-box'
                                        }}
                                        onChange={(e) => onDateChange(e.target.value, undefined)}
                                    />
                                    <Typography variant="body2" color={COLORS.text.muted} sx={{ fontWeight: 800 }}>-</Typography>
                                    <input
                                        type="date"
                                        style={{
                                            padding: '0 20px',
                                            borderRadius: BORDER_RADIUS.full,
                                            border: `1px solid ${COLORS.border.medium}`,
                                            outline: 'none',
                                            color: COLORS.text.primary,
                                            backgroundColor: COLORS.background.default,
                                            fontFamily: 'inherit',
                                            fontSize: '0.9rem',
                                            fontWeight: 500,
                                            height: '44px',
                                            boxSizing: 'border-box'
                                        }}
                                        onChange={(e) => onDateChange(undefined, e.target.value)}
                                    />
                                </>
                            )}
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Table Area */}
            <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                    borderRadius: BORDER_RADIUS.md,
                    border: `1px solid ${COLORS.border.light}`,
                    mb: 2,
                    overflow: 'hidden',
                    background: COLORS.background.paper
                }}
            >
                <Table sx={{ minWidth: 700 }} aria-label="advanced data table">
                    <TableHead sx={{ bgcolor: COLORS.background.default }}>
                        <TableRow>
                            {columns.map((col, index) => (
                                <TableCell
                                    key={col.header + index}
                                    align={col.align || 'left'}
                                    sx={{
                                        fontWeight: 800,
                                        color: COLORS.text.primary,
                                        fontSize: '0.8rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px',
                                        minWidth: col.minWidth,
                                        py: 1.25,
                                        borderBottom: `0px solid ${COLORS.border.medium}`,
                                        borderRight: (index < columns.length - 1 || (actions && actions.length > 0)) ? `1px solid ${COLORS.border.light}` : 'none'
                                    }}
                                >
                                    {col.header}
                                </TableCell>
                            ))}
                            {actions && actions.length > 0 && (
                                <TableCell
                                    align="center"
                                    sx={{
                                        fontWeight: 800,
                                        color: COLORS.text.primary,
                                        fontSize: '0.8rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px',
                                        py: 1.25,
                                        borderBottom: `1px solid ${COLORS.border.light}`
                                    }}
                                >
                                    Actions
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            [...Array(5)].map((_, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {columns.map((col, colIndex) => (
                                        <TableCell
                                            key={colIndex}
                                            sx={{
                                                py: 1.25,
                                                borderRight: (colIndex < columns.length - 1 || (actions && actions.length > 0)) ? `1px solid ${COLORS.border.light}` : 'none',
                                                borderBottom: `1px solid ${COLORS.border.light}`
                                            }}
                                        >
                                            <Skeleton animation="wave" height={24} width={colIndex === 0 ? "80%" : "60%"} />
                                        </TableCell>
                                    ))}
                                    {actions && actions.length > 0 && (
                                        <TableCell align="center" sx={{ borderBottom: `1px solid ${COLORS.border.light}`, py: 1.25 }}>
                                            <Skeleton animation="wave" variant="circular" width={24} height={24} sx={{ mx: 'auto' }} />
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length + (actions ? 1 : 0)}
                                    sx={{ textAlign: 'center', py: 10, color: COLORS.text.muted }}
                                >
                                    <Box sx={{ opacity: 0.5, mb: 1.5 }}>
                                        <SearchIcon sx={{ fontSize: 48 }} />
                                    </Box>
                                    <Typography variant="body1" fontWeight={600}>{emptyMessage}</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((row) => (
                                <TableRow
                                    key={rowKey(row)}
                                    hover
                                    sx={{
                                        transition: 'background-color 0.2s',
                                        '&:hover': { bgcolor: `${COLORS.primary.subtle}22 !important` },
                                        '&:last-child td': { borderBottom: 0 },
                                        '& td': { borderBottom: `1px solid ${COLORS.border.light}`, py: 1.25 }
                                    }}
                                >
                                    {columns.map((col, index) => (
                                        <TableCell key={col.header + index} align={col.align || 'left'} sx={{
                                            color: COLORS.text.secondary,
                                            fontSize: '0.9rem',
                                            fontWeight: 500,
                                            borderRight: (index < columns.length - 1 || (actions && actions.length > 0)) ? `1px solid ${COLORS.border.light}` : 'none'
                                        }}>
                                            {col.render
                                                ? col.render(row)
                                                : col.accessor
                                                    ? String((row as Record<string, unknown>)[col.accessor as string] ?? '')
                                                    : ''}
                                        </TableCell>
                                    ))}
                                    {actions && actions.length > 0 && (
                                        <TableCell align="center" sx={{ borderRight: 'none' }}>
                                            <IconButton
                                                size="small"
                                                onClick={(e) => handleActionClick(e, row)}
                                                sx={{
                                                    color: COLORS.text.muted,
                                                    '&:hover': { bgcolor: COLORS.primary.subtle, color: COLORS.primary.main }
                                                }}
                                            >
                                                <MoreVertIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

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
                        <Typography variant="body2" color={COLORS.text.muted} fontWeight={600}>
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
                        <Typography variant="body2" color={COLORS.text.muted} fontWeight={600}>
                            of {pagination.totalPages}
                        </Typography>
                    </Box>

                    <Pagination
                        count={pagination.totalPages}
                        page={pagination.page}
                        onChange={(_, val) => pagination.onPageChange(val)}
                        color="primary"
                        shape="rounded"
                        showFirstButton
                        showLastButton
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
