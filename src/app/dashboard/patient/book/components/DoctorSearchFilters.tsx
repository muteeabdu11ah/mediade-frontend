'use client';

import React from 'react';
import { Box, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Search } from '@mui/icons-material';
import { BORDER_RADIUS } from '@/lib/constants/design-tokens';
import { Specialty } from '@/lib/types';

interface DoctorSearchFiltersProps {
    search: string;
    onSearchChange: (val: string) => void;
    specialty: string;
    onSpecialtyChange: (val: string) => void;
}

const DoctorSearchFilters: React.FC<DoctorSearchFiltersProps> = ({
    search,
    onSearchChange,
    specialty,
    onSpecialtyChange,
}) => {
    return (
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexDirection: { xs: 'column', md: 'row' } }}>
            <TextField
                fullWidth
                placeholder="Search by doctor name, specialty, or clinic..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search sx={{ color: '#00BCD4' }} />
                            </InputAdornment>
                        ),
                        sx: {
                            borderRadius: BORDER_RADIUS.large,
                            bgcolor: 'white',
                            '& fieldset': { border: 'none' },
                            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                        }
                    }
                }}
            />
            <FormControl sx={{ minWidth: { md: 200 } }}>
                <Select
                    value={specialty}
                    onChange={(e) => onSpecialtyChange(e.target.value)}
                    displayEmpty
                    sx={{
                        borderRadius: BORDER_RADIUS.large,
                        bgcolor: 'white',
                        '& fieldset': { border: 'none' },
                        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                        '.MuiSelect-select': { py: 1.5 }
                    }}
                >
                    <MenuItem value="">All Specialties</MenuItem>
                    {Object.values(Specialty).map((s) => (
                        <MenuItem key={s} value={s}>
                            {s}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default DoctorSearchFilters;
