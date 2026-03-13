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
import { GRADIENTS, COLORS, BORDER_RADIUS, SHADOWS } from '@/lib/constants/design-tokens';
import StatusChip from '@/components/StatusChip';

interface AppointmentCardProps {
    appointment: Appointment;
    onMenuOpen: (event: React.MouseEvent<HTMLElement>, appointment: Appointment) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onMenuOpen }) => {
    const patientName = appointment.patient ? `${appointment.patient.firstName} ${appointment.patient.lastName}` : 'Unknown Patient';
    const isEmergency = appointment.isEmergency;

    return (
        <Card sx={{
            borderRadius: BORDER_RADIUS.lg,
            boxShadow: SHADOWS.small,
            border: `1px solid ${COLORS.border.light}`,
            position: 'relative',
            overflow: 'hidden',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: SHADOWS.medium,
            }
        }}>
            {/* Emergency Left Border indicator */}
            {isEmergency && <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, bgcolor: COLORS.error.main }} />}

            <CardContent sx={{ p: 3, pl: isEmergency ? 4 : 3, flexGrow: 1 }}>

                {/* Header Row */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                        {!isEmergency && (
                            <Avatar sx={{ width: 40, height: 40, bgcolor: COLORS.primary.subtle, color: COLORS.primary.main }}>
                                <PersonIcon />
                            </Avatar>
                        )}
                        <Box>
                            <Typography variant="body1" color={COLORS.text.primary}>
                                {patientName}
                            </Typography>
                            {isEmergency && appointment.escalatedBy ? (
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                    {appointment.escalatedBy}
                                </Typography>
                            ) : (
                                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                    {appointment.type}
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    {isEmergency ? (
                        <Chip
                            icon={<WarningIcon style={{ color: 'white' }} fontSize="small" />}
                            label="Emergency"
                            sx={{ bgcolor: COLORS.error.main, color: 'white', borderRadius: BORDER_RADIUS.sm }}
                        />
                    ) : (
                        <IconButton size="small" onClick={(e) => onMenuOpen(e, appointment)}>
                            <MoreVertIcon fontSize="small" />
                        </IconButton>
                    )}
                </Box>



                {/* Time Track */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: COLORS.primary.main }}>
                        <AccessTimeIcon fontSize="small" />
                        <Typography variant="body2">{appointment.startTime.substring(0, 5)}</Typography>
                        <Typography variant="caption" sx={{ color: COLORS.text.muted }}>(30 min)</Typography>
                    </Box>

                    {!isEmergency && (
                        <StatusChip status={appointment.status} />
                    )}
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 1.5, mt: 'auto' }}>
                    <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<VisibilityIcon />}
                        sx={{
                            borderRadius: BORDER_RADIUS.md,
                            borderWidth: 1.5,
                            '&:hover': { borderWidth: 1.5 }
                        }}
                    >
                        {'Notes'}
                    </Button>
                    <Button
                        variant="contained"
                        fullWidth
                        startIcon={<PlayArrowIcon />}
                        disableElevation
                        sx={{
                            borderRadius: BORDER_RADIUS.md,
                            boxShadow: SHADOWS.small
                        }}
                    >
                        Start
                    </Button>
                </Box>


            </CardContent>
        </Card>
    );
};

export default AppointmentCard;
