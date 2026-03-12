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
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            border: '1px solid #f0f0f0',
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
                        <Typography variant="h3" fontWeight={700} color="#2D3748">
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
                            <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#E6FBFC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00BCD4' }}>
                                <WorkOutlineIcon sx={{ fontSize: 14 }} />
                            </Box>
                            <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                {specialty}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#E6FBFC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00BCD4' }}>
                                <LocalHospitalOutlinedIcon sx={{ fontSize: 14 }} />
                            </Box>
                            <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                {clinicName}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Row 2: Date & Time */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#E6FBFC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00BCD4' }}>
                                <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />
                            </Box>
                            <Typography variant="body2" color="#1A202C" fontWeight={600}>
                                {dateStr}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#E6FBFC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00BCD4' }}>
                                <ScheduleOutlinedIcon sx={{ fontSize: 14 }} />
                            </Box>
                            <Typography variant="body2" color="text.secondary" fontWeight={500}>
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
                            color: '#00BCD4',
                            borderColor: '#00BCD4',
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 3,
                            '&:hover': {
                                borderColor: '#0097A7',
                                bgcolor: '#F0FDFE'
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

