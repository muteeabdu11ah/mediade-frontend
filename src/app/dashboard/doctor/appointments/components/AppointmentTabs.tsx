import React from 'react';
import { Box, Button } from '@mui/material';

interface AppointmentTabsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const AppointmentTabs: React.FC<AppointmentTabsProps> = ({ activeTab, setActiveTab }) => {
    return (
        <Box sx={{ display: 'flex', gap: 1, bgcolor: 'white', p: 0.5, borderRadius: 2, border: '1px solid rgba(0,0,0,0.05)' }}>
            <Button
                variant="contained"
                disableElevation
                onClick={() => setActiveTab('Appointments')}
                sx={{
                    bgcolor: activeTab === 'Appointments' ? 'rgba(31,178,186,0.15)' : 'transparent',
                    color: activeTab === 'Appointments' ? '#0f7e85' : 'text.secondary',
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontWeight: activeTab === 'Appointments' ? 700 : 500,
                    px: 3,
                    '&:hover': { bgcolor: activeTab === 'Appointments' ? 'rgba(31,178,186,0.2)' : 'rgba(0,0,0,0.02)' }
                }}
            >
                Appointments
            </Button>
            <Button
                variant="text"
                onClick={() => setActiveTab('Onsite')}
                sx={{
                    bgcolor: activeTab === 'Onsite' ? 'rgba(31,178,186,0.15)' : 'transparent',
                    color: activeTab === 'Onsite' ? '#0f7e85' : 'text.secondary',
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontWeight: activeTab === 'Onsite' ? 700 : 500,
                    px: 3,
                    '&:hover': { bgcolor: activeTab === 'Onsite' ? 'rgba(31,178,186,0.2)' : 'rgba(0,0,0,0.02)' }
                }}
            >
                Onsite Consultation
            </Button>
        </Box>
    );
};

export default AppointmentTabs;
