'use client';

import React from 'react';
import {
    Box,
    InputBase,
    Select,
    MenuItem,
    SelectChangeEvent,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { COLORS, BORDER_RADIUS } from '@/lib/constants/design-tokens';

interface DataTableFiltersProps {
    onSearch?: (term: string) => void;
    searchPlaceholder?: string;
    statusOptions?: { value: string; label: string }[];
    statusValue?: string;
    onStatusChange?: (value: string) => void;
    onDateChange?: (date?: string) => void;
}

export const DataTableFilters = ({
    onSearch,
    searchPlaceholder = 'Search...',
    statusOptions,
    statusValue = 'all',
    onStatusChange,
    onDateChange,
}: DataTableFiltersProps) => {
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
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                alignItems: { xs: 'stretch', sm: 'center' },
                width: { xs: '100%', md: 'auto' },
                ml: { xs: 0, md: 'auto' }
            }}>
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
                            minWidth: { xs: '100%', sm: 140 },
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

                {/* Date Filters */}
                {onDateChange !== undefined && (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 1.5,
                        alignItems: { xs: 'stretch', sm: 'center' },
                        width: { xs: '100%', sm: 'auto' }
                    }}>
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
                                boxSizing: 'border-box',
                                width: '100%',
                                minWidth: '150px'
                            }}
                            onChange={(e) => onDateChange(e.target.value)}
                        />
                    </Box>
                )}
            </Box>
        </Box>
    );
};
