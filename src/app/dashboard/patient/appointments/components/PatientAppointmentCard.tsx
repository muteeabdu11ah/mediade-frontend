import React from 'react';
import { Box, Typography, Card, Button, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Appointment, AppointmentStatus } from '@/lib/types';
import StatusChip from '@/components/StatusChip';
import { COLORS, BORDER_RADIUS } from '@/lib/constants/design-tokens';

interface PatientAppointmentCardProps {
    appointment: Appointment;
    onMenuOpen?: (event: React.MouseEvent<HTMLElement>, appointment: Appointment) => void;
}

const PatientAppointmentCard: React.FC<PatientAppointmentCardProps> = ({ appointment, onMenuOpen }) => {
    // Treat doctor object properly and get presigned URL
    const doctorObj = appointment.doctor as any;
    const doctorName = appointment.doctor ? `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}` : 'Unknown Doctor';
    const specialty = appointment.doctor?.doctorProfile?.specialty || appointment.type || 'Consultation';
    const clinicName = appointment.clinic?.name || 'Unknown Clinic';

    // Fallback to a placeholder if no signed URL is available
    const profileImageUrl = doctorObj?.profileImageUrl || 'https://via.placeholder.com/150';

    // Format Date (e.g., "Mar 8")
    const apptDate = new Date(appointment.appointmentDate);
    const dateStr = apptDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // Format Time (e.g., "10:00 AM")
    const timeParts = appointment.startTime.split(':');
    let hour = parseInt(timeParts[0], 10);
    const min = timeParts[1];
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    const timeStr = `${hour}:${min} ${ampm}`;

    return (
        <Card sx={{
            borderRadius: BORDER_RADIUS.md,
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            border: `1px solid ${COLORS.border.light}`,
            display: 'flex',
            flexDirection: 'row',
            p: 2,
            gap: 2.5,
            bgcolor: 'white'
        }}>
            {/* Left side: Image */}
            <Box
                component="img"
                src={profileImageUrl}
                alt={doctorName}
                sx={{
                    width: 120,
                    height: 160,
                    objectFit: 'cover',
                    borderRadius: 3,
                    flexShrink: 0
                }}
            />

            {/* Right side: Content */}
            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>

                {/* Header: Name and More Icon */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography variant="h3" color={COLORS.text.primary}>
                            {doctorName}
                        </Typography>
                        <StatusChip status={appointment.status} />
                    </Box>
                    {appointment.status === AppointmentStatus.UPCOMING && onMenuOpen && (
                        <IconButton size="small" onClick={(e) => onMenuOpen(e, appointment)}>
                            <MoreVertIcon />
                        </IconButton>
                    )}
                </Box>

                {/* Sub-info Rows */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
                    {/* Row 1: Specialty & Clinic */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: COLORS.primary.subtle, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.primary.main }}>
                                <WorkOutlineIcon sx={{ fontSize: 14 }} />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                {specialty}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: COLORS.primary.subtle, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.primary.main }}>
                                <LocalHospitalOutlinedIcon sx={{ fontSize: 14 }} />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                {clinicName}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Row 2: Date & Time */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: COLORS.primary.subtle, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.primary.main }}>
                                <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />
                            </Box>
                            <Typography variant="body2" color={COLORS.text.primary}>
                                {dateStr}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: COLORS.primary.subtle, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.primary.main }}>
                                <ScheduleOutlinedIcon sx={{ fontSize: 14 }} />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                {timeStr}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Action Button */}
                <Box sx={{ mt: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<VisibilityOutlinedIcon />}
                        sx={{
                            color: COLORS.primary.main,
                            borderColor: COLORS.primary.main,
                            borderRadius: BORDER_RADIUS.md,
                            textTransform: 'none',
                            px: 3,
                            '&:hover': {
                                borderColor: COLORS.primary.dark,
                                bgcolor: COLORS.primary.subtle
                            }
                        }}
                    >
                        Intake Notes
                    </Button>
                </Box>
            </Box>
        </Card>
    );
};

export default PatientAppointmentCard;

