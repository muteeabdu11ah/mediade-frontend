import React from 'react';
import { Box, Select, MenuItem } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

interface AppointmentFiltersProps {
    selectedType: string;
    setSelectedType: (type: string) => void;
}

const AppointmentFilters: React.FC<AppointmentFiltersProps> = ({ selectedType, setSelectedType }) => {
    return (
        <Box sx={{ display: 'flex', gap: 2 }}>
            <Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as string)}
                displayEmpty
                size="small"
                sx={{
                    bgcolor: 'white',
                    borderRadius: 2,
                    color: 'text.secondary',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.1)' }
                }}
                renderValue={(value) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon fontSize="small" />
                        {value === 'All' ? 'All Appointments' : value}
                    </Box>
                )}
            >
                <MenuItem value="All">All Appointments</MenuItem>
                <MenuItem value="Consultation">Consultation</MenuItem>
                <MenuItem value="Emergency">Emergency</MenuItem>
            </Select>
        </Box>
    );
};

export default AppointmentFilters;
