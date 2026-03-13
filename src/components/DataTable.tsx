'use client';

import { COLORS } from '@/lib/constants/design-tokens';

import React from 'react';
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
} from '@mui/material';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ColumnDef<T> {
    header: string;
    accessor?: keyof T;
    render?: (row: T) => React.ReactNode;
    align?: 'left' | 'center' | 'right';
    minWidth?: number;
}

export interface DataTablePagination {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

interface DataTableProps<T> {
    columns: ColumnDef<T>[];
    data: T[];
    isLoading: boolean;
    emptyMessage?: string;
    pagination?: DataTablePagination;
    rowKey: (row: T) => string;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function DataTable<T>({
    columns,
    data,
    isLoading,
    emptyMessage = 'No data found.',
    pagination,
    rowKey,
}: DataTableProps<T>) {
    if (isLoading) {
        return (
            <TableContainer
                component={Paper}
                elevation={0}
                sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.04)', minHeight: 300 }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
                    <CircularProgress />
                </Box>
            </TableContainer>
        );
    }

    return (
        <TableContainer
            component={Paper}
            elevation={0}
            sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.04)', minHeight: 300 }}
        >
            <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ bgcolor: 'rgba(46, 194, 201, 0.02)' }}>
                    <TableRow>
                        {columns.map((col) => (
                            <TableCell
                                key={col.header}
                                align={col.align || 'left'}
                                sx={{
                                    fontWeight: 600,
                                    color: COLORS.text.secondary,
                                    textTransform: 'uppercase',
                                    fontSize: '0.8rem',
                                    letterSpacing: '0.5px',
                                    minWidth: col.minWidth,
                                }}
                            >
                                {col.header}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}
                            >
                                <Typography variant="body2">{emptyMessage}</Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((row) => (
                            <TableRow
                                key={rowKey(row)}
                                hover
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                {columns.map((col) => (
                                    <TableCell key={col.header} align={col.align || 'left'}>
                                        {col.render
                                            ? col.render(row)
                                            : col.accessor
                                                ? String((row as Record<string, unknown>)[col.accessor as string] ?? '')
                                                : ''}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {pagination && pagination.totalPages > 1 && (
                <Box
                    sx={{
                        p: 3,
                        display: 'flex',
                        justifyContent: 'center',
                        borderTop: '1px solid rgba(0,0,0,0.04)',
                    }}
                >
                    <Pagination
                        count={pagination.totalPages}
                        page={pagination.page}
                        onChange={(_, val) => pagination.onPageChange(val)}
                        color="primary"
                    />
                </Box>
            )}
        </TableContainer>
    );
}
