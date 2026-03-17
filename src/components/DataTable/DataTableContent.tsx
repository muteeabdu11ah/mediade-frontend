'use client';

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
    Typography,
    Skeleton,
    IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { COLORS, BORDER_RADIUS } from '@/lib/constants/design-tokens';
import { ColumnDef, ActionDef } from '../AdvancedDataTable';

interface DataTableContentProps<T> {
    columns: ColumnDef<T>[];
    data: T[];
    isLoading: boolean;
    emptyMessage: string;
    rowKey: (row: T) => string;
    actions?: ActionDef<T>[];
    onActionClick?: (event: React.MouseEvent<HTMLElement>, row: T) => void;
}

export function DataTableContent<T>({
    columns,
    data,
    isLoading,
    emptyMessage,
    rowKey,
    actions,
    onActionClick,
}: DataTableContentProps<T>) {
    return (
        <TableContainer
            component={Paper}
            elevation={0}
            sx={{
                borderRadius: BORDER_RADIUS.md,
                border: `1px solid ${COLORS.border.light}`,
                mb: 2,
                overflowX: 'auto',
                background: COLORS.background.paper
            }}
        >
            <Table sx={{ minWidth: 700 }} aria-label="advanced data table">
                <TableHead sx={{ bgcolor: COLORS.background.default }}>
                    <TableRow>
                        {columns.map((col, index) => (
                            <TableCell
                                key={col.header + index}
                                align={col.header === 'Actions' ? 'center' : (col.align || 'left')}
                                sx={{
                                    fontWeight: 600,
                                    color: COLORS.text.primary,
                                    fontSize: '0.8rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
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
                                    fontWeight: 600,
                                    color: COLORS.text.primary,
                                    fontSize: '0.8rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
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
                                <Typography variant="body1">{emptyMessage}</Typography>
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
                                    <TableCell key={col.header + index} align={col.header === 'Actions' ? 'center' : (col.align || 'left')} sx={{
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
                                            onClick={(e) => onActionClick && onActionClick(e, row)}
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
    );
}
