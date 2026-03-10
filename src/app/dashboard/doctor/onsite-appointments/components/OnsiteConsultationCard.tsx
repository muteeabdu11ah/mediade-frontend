import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Avatar,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { OnsiteConsultation } from '@/lib/types';

interface OnsiteConsultationCardProps {
    consult: OnsiteConsultation;
}

const OnsiteConsultationCard: React.FC<OnsiteConsultationCardProps> = ({ consult }) => {
    return (
        <Card sx={{
            borderRadius: 3,
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            border: '1px solid #f0f0f0',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <CardContent sx={{ p: 3, flexGrow: 1 }}>
                {/* Header Row */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <Avatar sx={{ width: 40, height: 40, bgcolor: 'rgba(31,178,186,0.1)', color: '#1fb2ba' }}>
                            {consult.firstName.charAt(0)}{consult.lastName.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography variant="body1" fontWeight={700} color="#1A2B3C">
                                {consult.firstName} {consult.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Walk-in Consult
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Contact & Date */}
                <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {consult.phone && (
                        <Typography variant="body2" color="text.secondary">
                            <strong>Phone:</strong> {consult.phone}
                        </Typography>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#1fb2ba', mt: 1 }}>
                        <CalendarTodayIcon fontSize="small" />
                        <Typography variant="body2" fontWeight={600}>
                            {new Date(consult.createdAt).toLocaleDateString()}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5, mt: 'auto' }}>
                    <Button
                        variant="contained"
                        fullWidth
                        startIcon={<PlayArrowIcon />}
                        disableElevation
                        sx={{ bgcolor: '#1fb2ba', color: 'white', borderRadius: 2, '&:hover': { bgcolor: '#148991' } }}
                    >
                        Resume Consult
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default OnsiteConsultationCard;
