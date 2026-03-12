import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Chip,
    IconButton,
    Avatar,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@mui/icons-material/Person';
import WarningIcon from '@mui/icons-material/Warning';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Appointment, AppointmentStatus } from '@/lib/types';
import { GRADIENTS } from '@/lib/constants/design-tokens';

interface AppointmentCardProps {
    appointment: Appointment;
    onMenuOpen: (event: React.MouseEvent<HTMLElement>, appointment: Appointment) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onMenuOpen }) => {
    const patientName = appointment.patient ? `${appointment.patient.firstName} ${appointment.patient.lastName}` : 'Unknown Patient';
    const isEmergency = appointment.isEmergency;

    return (
        <Card sx={{
            borderRadius: 3,
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            border: '1px solid #f0f0f0',
            position: 'relative',
            overflow: 'hidden',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Emergency Left Border indicator */}
            {isEmergency && <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, bgcolor: '#ef4444' }} />}

            <CardContent sx={{ p: 3, pl: isEmergency ? 4 : 3, flexGrow: 1 }}>

                {/* Header Row */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                        {!isEmergency && (
                            <Avatar sx={{ width: 40, height: 40, bgcolor: '#f0f9ff', color: '#1fb2ba' }}>
                                <PersonIcon />
                            </Avatar>
                        )}
                        <Box>
                            <Typography variant="body1" fontWeight={700} color="#1A2B3C">
                                {patientName}
                            </Typography>
                            {isEmergency && appointment.escalatedBy ? (
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                    {appointment.escalatedBy}
                                </Typography>
                            ) : (
                                <Typography variant="caption" color="text.secondary">
                                    {appointment.type}
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    {isEmergency ? (
                        <Chip
                            icon={<WarningIcon style={{ color: 'white' }} fontSize="small" />}
                            label="Emergency"
                            sx={{ bgcolor: '#ef4444', color: 'white', fontWeight: 700, borderRadius: 2 }}
                        />
                    ) : (
                        <IconButton size="small" onClick={(e) => onMenuOpen(e, appointment)}>
                            <MoreVertIcon fontSize="small" />
                        </IconButton>
                    )}
                </Box>

            

                {/* Time Track */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#1fb2ba' }}>
                        <AccessTimeIcon fontSize="small" />
                        <Typography variant="body2" fontWeight={700}>{appointment.startTime.substring(0, 5)}</Typography>
                        <Typography variant="caption" color="text.secondary">(30 min)</Typography>
                    </Box>

                    {!isEmergency && (
                        <Chip
                            label={appointment.status.toUpperCase()}
                            size="small"
                            sx={{
                                bgcolor: appointment.status === AppointmentStatus.COMPLETED ? 'rgba(16,185,129,0.1)' : 'rgba(31,178,186,0.1)',
                                color: appointment.status === AppointmentStatus.COMPLETED ? '#10b981' : '#1fb2ba',
                                fontWeight: 600
                            }}
                        />
                    )}
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 1.5, mt: 'auto' }}>
                    <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<VisibilityIcon />}
                        sx={{ borderColor: 'rgba(31,178,186,0.3)', color: '#1fb2ba', borderRadius: 2 }}
                    >
                        {'Intake Notes'}
                    </Button>
                    <Button
                        variant="contained"
                        fullWidth
                        startIcon={<PlayArrowIcon />}
                        disableElevation
                        sx={{ color: 'white', borderRadius: 2, '&:hover': { bgcolor: '#148991' }, background: GRADIENTS.primary }}
                    >
                        Start Consult
                    </Button>
                </Box>

            </CardContent>
        </Card>
    );
};

export default AppointmentCard;
