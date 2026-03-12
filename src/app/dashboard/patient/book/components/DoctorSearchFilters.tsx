'use client';

import React from 'react';
import { Box, InputBase, Select, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Specialty } from '@/lib/types';

interface DoctorSearchFiltersProps {
    search: string;
    onSearchChange: (val: string) => void;
    specialty: string;
    onSpecialtyChange: (val: string) => void;
}

const PILL_SX = {
    bgcolor: 'white',
    borderRadius: '50px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    border: '1px solid #eef0f3',
    display: 'flex',
    alignItems: 'center',
};

const DoctorSearchFilters: React.FC<DoctorSearchFiltersProps> = ({
    search,
    onSearchChange,
    specialty,
    onSpecialtyChange,
}) => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                // gap: 20,
                mb: 4,
            }}
        >
            {/* Search pill — takes up most of the row */}
            <Box sx={{ ...PILL_SX, flex: 1, px: 2, py: 0.75, gap: 1, maxWidth: 400 }}>
                <SearchIcon sx={{ color: '#b0bec5', fontSize: 20, flexShrink: 0 }} />
                <InputBase
                    fullWidth
                    placeholder="Search by doctor name, specialty, or hospital"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    sx={{
                        fontSize: '0.875rem',
                        color: '#37474f',
                        '& input::placeholder': { color: '#90a4ae', opacity: 1 },
                    }}
                />
            </Box>

            {/* Specialty pill — sits separately on the right */}
            <Box sx={{ ...PILL_SX, px: 2, py: 0.5, flexShrink: 0 }}>
                <Select
                    value={specialty}
                    onChange={(e) => onSpecialtyChange(e.target.value)}
                    displayEmpty
                    variant="standard"
                    disableUnderline
                    renderValue={(val) => (val === '' ? 'Specialty' : val as string)}
                    sx={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: '#546e7a',
                        '& .MuiSelect-select': {
                            py: 0.5,
                            pr: '28px !important',
                            pl: 0,
                            bgcolor: 'transparent',
                            '&:focus': { bgcolor: 'transparent' },
                        },
                        '& .MuiSelect-icon': { color: '#546e7a', right: 0 },
                    }}
                    MenuProps={{
                        PaperProps: {
                            sx: { borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)', mt: 1 }
                        }
                    }}
                >
                    <MenuItem value="">All Specialties</MenuItem>
                    {Object.values(Specialty).map((s) => (
                        <MenuItem key={s} value={s} sx={{ fontSize: '0.875rem' }}>
                            {s}
                        </MenuItem>
                    ))}
                </Select>
            </Box>
        </Box>
    );
};

export default DoctorSearchFilters;
