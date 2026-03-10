'use client';

import React from 'react';
import { Box, TextField, Select, MenuItem, Paper, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface FilterOption {
    value: string;
    label: string;
}

export interface FilterConfig {
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[];
    label?: string;
    gridSize?: { xs?: number; md?: number };
}

interface SearchFilterBarProps {
    search: {
        value: string;
        onChange: (value: string) => void;
        placeholder?: string;
    };
    filters?: FilterConfig[];
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function SearchFilterBar({ search, filters }: SearchFilterBarProps) {
    return (
        <Paper
            sx={{
                p: 2,
                mb: 4,
                borderRadius: 4,
                boxShadow: '0 4px 24px rgba(0,0,0,0.02)',
                border: '1px solid rgba(0,0,0,0.04)',
            }}
        >
            <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, md: filters?.length ? 12 - (filters.length * 3) : 12 }}>
                    <TextField
                        fullWidth
                        placeholder={search.placeholder || 'Search...'}
                        value={search.value}
                        onChange={(e) => search.onChange(e.target.value)}
                        InputProps={{
                            startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                        }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                </Grid>
                {filters?.map((filter, idx) => (
                    <Grid key={idx} size={filter.gridSize || { xs: 12, md: 3 }}>
                        <Select
                            fullWidth
                            value={filter.value}
                            onChange={(e) => filter.onChange(e.target.value)}
                            sx={{ borderRadius: 3 }}
                            displayEmpty
                        >
                            {filter.options.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
}
