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
    CircularProgress,
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
import theme from '@/theme/theme';

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
        <Box sx={{ width: '100%', bgcolor: 'white', borderRadius: '16px', p: '24px', border: '0.8px solid #F0F1F3' }}>
            {/* Top Action Bar */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'stretch', md: 'center' },
                    mb: 3,
                    gap: 2,
                }}
            >
                {/* Search Input */}
                {onSearch !== undefined && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            bgcolor: '#fff',
                            border: '1px solid rgba(0,0,0,0.1)',
                            borderRadius: '24px',
                            px: 2,
                            py: 0.5,
                            flex: 1,
                            maxWidth: { xs: '100%', md: '450px' },
                        }}
                    >
                        <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                        <InputBase
                            placeholder={searchPlaceholder}
                            onChange={handleSearchChange}
                            sx={{ flex: 1, fontSize: '0.875rem' }}
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
                                bgcolor: '#fff',
                                borderRadius: '24px',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(0,0,0,0.1)',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(0,0,0,0.2)',
                                },
                                minWidth: 120,
                                '& .MuiSelect-select': {
                                    py: 1,
                                    pl: 2,
                                    fontSize: '0.875rem',
                                    color: 'text.secondary',
                                }
                            }}
                        >
                            <MenuItem value="all">Status</MenuItem>
                            {statusOptions.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </MenuItem>
                            ))}
                        </Select>
                    )}

                    {/* Date Filters (Dropdown + Inputs) */}
                    {onDateChange !== undefined && (
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Select
                                value={dateFilterType}
                                onChange={(e) => setDateFilterType(e.target.value as 'Date' | 'Date Range')}
                                size="small"
                                sx={{
                                    bgcolor: '#fff',
                                    borderRadius: '24px',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(0,0,0,0.1)',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(0,0,0,0.2)',
                                    },
                                    minWidth: 100,
                                    height: '38px',
                                    '& .MuiSelect-select': {
                                        py: 1,
                                        pl: 2,
                                        fontSize: '0.875rem',
                                        color: 'text.secondary',
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
                                        padding: '0 16px',
                                        borderRadius: '24px',
                                        border: '1px solid rgba(0,0,0,0.1)',
                                        outline: 'none',
                                        color: '#475569',
                                        fontFamily: 'inherit',
                                        fontSize: '0.875rem',
                                        height: '38px',
                                        boxSizing: 'border-box'
                                    }}
                                    onChange={(e) => onDateChange(e.target.value, e.target.value)}
                                />
                            ) : (
                                <>
                                    <input
                                        type="date"
                                        style={{
                                            padding: '0 16px',
                                            borderRadius: '24px',
                                            border: '1px solid rgba(0,0,0,0.1)',
                                            outline: 'none',
                                            color: '#475569',
                                            fontFamily: 'inherit',
                                            fontSize: '0.875rem',
                                            height: '38px',
                                            boxSizing: 'border-box'
                                        }}
                                        onChange={(e) => onDateChange(e.target.value, undefined)}
                                    />
                                    <Typography variant="body2" color="text.secondary">-</Typography>
                                    <input
                                        type="date"
                                        style={{
                                            padding: '0 16px',
                                            borderRadius: '24px',
                                            border: '1px solid rgba(0,0,0,0.1)',
                                            outline: 'none',
                                            color: '#475569',
                                            fontFamily: 'inherit',
                                            fontSize: '0.875rem',
                                            height: '38px',
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
                    borderRadius: '8px',
                    border: '1px solid rgba(0,0,0,0.08)',
                    mb: 4,
                    overflow: 'hidden'
                }}
            >
                {isLoading ? (
                    <Table sx={{ minWidth: 700 }} aria-label="loading data table">
                        <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                            <TableRow>
                                {columns.map((col, index) => (
                                    <TableCell
                                        key={index}
                                        sx={{
                                            py: 1.5,
                                            borderBottom: '1px solid rgba(0,0,0,0.08)',
                                            borderRight: (index < columns.length - 1 || (actions && actions.length > 0)) ? '1px solid rgba(0,0,0,0.08)' : 'none'
                                        }}
                                    >
                                        <Skeleton animation="wave" height={20} width="60%" />
                                    </TableCell>
                                ))}
                                {actions && actions.length > 0 && (
                                    <TableCell
                                        sx={{
                                            py: 1.5,
                                            borderBottom: '1px solid rgba(0,0,0,0.08)'
                                        }}
                                    >
                                        <Skeleton animation="wave" height={20} width={40} />
                                    </TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {[...Array(5)].map((_, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {columns.map((col, colIndex) => (
                                        <TableCell
                                            key={colIndex}
                                            sx={{
                                                py: 1.5,
                                                borderRight: (colIndex < columns.length - 1 || (actions && actions.length > 0)) ? '1px solid rgba(0,0,0,0.06)' : 'none'
                                            }}
                                        >
                                            <Skeleton animation="wave" height={24} width={colIndex === 0 ? "80%" : "60%"} />
                                        </TableCell>
                                    ))}
                                    {actions && actions.length > 0 && (
                                        <TableCell align="center" sx={{ borderRight: 'none', py: 1.5 }}>
                                            <Skeleton animation="wave" variant="circular" width={24} height={24} sx={{ mx: 'auto' }} />
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <Table sx={{ minWidth: 700 }} aria-label="advanced data table">
                        <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                            <TableRow>
                                {columns.map((col, index) => (
                                    <TableCell
                                        key={col.header + index}
                                        align={col.align || 'left'}
                                        sx={{
                                            fontWeight: 600,
                                            color: '#334155',
                                            fontSize: '0.85rem',
                                            minWidth: col.minWidth,
                                            py: 1.5,
                                            borderBottom: '1px solid rgba(0,0,0,0.08)',
                                            borderRight: (index < columns.length - 1 || (actions && actions.length > 0)) ? '1px solid rgba(0,0,0,0.08)' : 'none'
                                        }}
                                    >
                                        {col.header}
                                    </TableCell>
                                ))}
                                {actions && actions.length > 0 && (
                                    <TableCell
                                        align="center"
                                        sx={{
                                            fontWeight: 600,
                                            color: '#334155',
                                            fontSize: '0.85rem',
                                            py: 1.5,
                                            borderBottom: '1px solid rgba(0,0,0,0.08)'
                                        }}
                                    >
                                        Actions
                                    </TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}
                                    >
                                        <Typography variant="body2">{emptyMessage}</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((row) => (
                                    <TableRow
                                        key={rowKey(row)}
                                        hover
                                        sx={{
                                            '&:last-child td, &:last-child th': { borderBottom: 0 },
                                            '& td': { borderBottom: '1px solid rgba(0,0,0,0.06)', py: 1.5 }
                                        }}
                                    >
                                        {columns.map((col, index) => (
                                            <TableCell key={col.header + index} align={col.align || 'left'} sx={{
                                                color: '#475569',
                                                fontSize: '0.875rem',
                                                borderRight: (index < columns.length - 1 || (actions && actions.length > 0)) ? '1px solid rgba(0,0,0,0.06)' : 'none'
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
                                                <IconButton size="small" onClick={(e) => handleActionClick(e, row)}>
                                                    <MoreVertIcon fontSize="small" sx={{ color: '#64748B' }} />
                                                </IconButton>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                )}
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
                        mt: 0.5,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        borderRadius: '2',
                        minWidth: 180
                    }
                }}
            >
                <MenuList dense>
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
                                color: action.color === 'error' ? 'error.main' : 'text.secondary',
                                py: 1
                            }}
                        >
                            {action.icon && (
                                <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>
                                    {action.icon}
                                </ListItemIcon>
                            )}
                            <ListItemText primary={action.label} primaryTypographyProps={{ variant: 'body2' }} />
                        </MenuItem>
                    ))}
                </MenuList>
            </Popover>

            {/* Pagination Footer */}
            {pagination && pagination.totalPages > 1 && (
                <Box
                    sx={{
                        display: 'flex',
                        bgcolor: '#fff',
                        borderRadius: '8px',
                        border: '1px solid rgba(0,0,0,0.06)',
                        px: 3,
                        py: 2,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Page
                        </Typography>
                        <Select
                            size="small"
                            value={String(pagination.page)}
                            onChange={(e) => pagination.onPageChange(Number(e.target.value))}
                            sx={{
                                borderRadius: 2,
                                bgcolor: 'rgba(0,0,0,0.02)',
                                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                            }}
                        >
                            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(num => (
                                <MenuItem key={num} value={String(num)}>{num}</MenuItem>
                            ))}
                        </Select>
                        <Typography variant="body2" color="text.secondary">
                            of {pagination.totalPages}
                        </Typography>
                    </Box>

                    <Pagination
                        count={pagination.totalPages}
                        page={pagination.page}
                        onChange={(_, val) => pagination.onPageChange(val)}
                        color="standard"
                        shape="rounded"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            )}
        </Box>
    );
}
