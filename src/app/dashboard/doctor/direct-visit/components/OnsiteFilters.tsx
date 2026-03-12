import React from 'react';
import { Box, Select, MenuItem, Button } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { GRADIENTS } from '@/lib/constants/design-tokens';

interface OnsiteFiltersProps {
    dateFilter: string;
    setDateFilter: (filter: string) => void;
    onNewConsultation: () => void;
}

const OnsiteFilters: React.FC<OnsiteFiltersProps> = ({ dateFilter, setDateFilter, onNewConsultation }) => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as string)}
                displayEmpty
                size="small"
                sx={{
                    bgcolor: 'white',
                    borderRadius: 2,
                    color: 'text.secondary',
                    minWidth: 160,
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.1)' }
                }}
                startAdornment={<CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />}
            >
                <MenuItem value="all">All Time</MenuItem>
                <MenuItem value="past_week">Past Week</MenuItem>
                <MenuItem value="past_month">Past Month</MenuItem>
                <MenuItem value="past_6_months">Past 6 Months</MenuItem>
            </Select>

            <Button
                variant="contained"
                disableElevation
                sx={{ color: GRADIENTS.primary, borderRadius: 1, '&:hover': { color: GRADIENTS.primary } }}
                onClick={onNewConsultation}
            >
                New Consultation
            </Button>
        </Box>
    );
};

export default OnsiteFilters;
