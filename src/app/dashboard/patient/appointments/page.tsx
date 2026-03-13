'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Typography,
    Card,
    CircularProgress,
    Alert,
    Pagination,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Stack,
    Button,
    Menu,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FilterListIcon from '@mui/icons-material/FilterList';

import { Role, AppointmentStatus, Appointment, Specialty } from '@/lib/types';

// Sub-components
import PatientAppointmentCard from './components/PatientAppointmentCard';
import CalendarWeekly from '@/components/Calendar/CalendarWeekly';
import CalendarMonthly from '@/components/Calendar/CalendarMonthly';
import { GRADIENTS, COLORS, BORDER_RADIUS } from '@/lib/constants/design-tokens';

import { usePatientAppointments, usePatientAppointmentStats, useUpdateAppointmentStatus } from '@/hooks/use-appointments';
import { EditCalendarOutlined } from '@mui/icons-material';

type ViewMode = 'Weekly' | 'Monthly';

export default function PatientAppointmentsPage() {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<ViewMode>('Weekly');
    const [page, setPage] = useState(1);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');

    // Calculate start/end for stats fetching
    const statsRange = useMemo(() => {
        const start = new Date(selectedDate);
        const end = new Date(selectedDate);

        if (viewMode === 'Weekly') {
            const day = start.getDay();
            start.setDate(start.getDate() - day);
            end.setDate(start.getDate() + 6);
        } else {
            start.setDate(1);
            end.setMonth(end.getMonth() + 1);
            end.setDate(0);
        }

        const formatDate = (date: Date) => {
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        };

        return { startDate: formatDate(start), endDate: formatDate(end) };
    }, [selectedDate, viewMode]);

    // React Query Hooks
    const { data: stats = {} } = usePatientAppointmentStats(statsRange);

    const {
        data: appointmentsData,
        isLoading,
        error
    } = usePatientAppointments({
        page,
        limit: 10,
        specialty: specialtyFilter,
        startDate: `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`,
        endDate: `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
    });

    const updateStatusMutation = useUpdateAppointmentStatus();

    const appointments = appointmentsData?.data || [];
    const totalPages = appointmentsData?.meta?.totalPages || 1;

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setPage(1);
        if (viewMode === 'Monthly') {
            setViewMode('Weekly');
        }
    };

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, appointment: Appointment) => {
        setAnchorEl(event.currentTarget);
        setSelectedAppointment(appointment);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedAppointment(null);
    };

    const handleCancelClick = () => {
        handleMenuClose();
        setIsCancelDialogOpen(true);
    };

    const handleConfirmCancel = async () => {
        if (!selectedAppointment) return;
        try {
            await updateStatusMutation.mutateAsync({
                id: selectedAppointment.id,
                status: AppointmentStatus.CANCELLED,
                reason: cancelReason
            });
            setIsCancelDialogOpen(false);
            setCancelReason('');
            setSelectedAppointment(null);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to cancel appointment');
        }
    };

    return (
        <>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, justifyContent: 'flex-end' }}>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end">
                    <FormControl size="small" sx={{ minWidth: 160 }}>
                        <Select
                            value={viewMode}
                            onChange={(e) => setViewMode(e.target.value as ViewMode)}
                            sx={{ borderRadius: 2, bgcolor: 'white' }}
                            startAdornment={<CalendarMonthIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />}
                        >
                            <MenuItem value="Weekly">Weekly View</MenuItem>
                            <MenuItem value="Monthly">Monthly View</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <Select
                            value={specialtyFilter}
                            onChange={(e) => {
                                setSpecialtyFilter(e.target.value);
                                setPage(1);
                            }}
                            sx={{ borderRadius: 2, bgcolor: 'white' }}
                            startAdornment={<FilterListIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />}
                        >
                            <MenuItem value="all">All Specialties</MenuItem>
                            {Object.values(Specialty).map(spec => (
                                <MenuItem key={spec} value={spec}>{spec}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        startIcon={<EditCalendarOutlined />}
                        onClick={() => router.push('/dashboard/patient/appointments/book')}
                        sx={{
                            borderRadius: BORDER_RADIUS.md,
                            px: 3,
                            py: 1.25,
                            bgcolor: COLORS.primary.main,
                            color: 'white',
                            '&:hover': {
                                bgcolor: COLORS.primary.dark,
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)',
                            },
                            transition: 'all 0.3s ease',
                            fontWeight: 600,
                            textTransform: 'none',
                        }}
                    >
                        Book Appointment
                    </Button>
                </Stack>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{(error as any)?.message || 'Failed to load appointments.'}</Alert>}

            {viewMode === 'Weekly' ? (
                <CalendarWeekly
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                    onNavigate={setSelectedDate}
                    stats={stats}
                />
            ) : (
                <CalendarMonthly
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                    onNavigate={setSelectedDate}
                    stats={stats}
                />
            )}

            {viewMode === 'Weekly' && (
                <Box sx={{ mt: 4 }}>
                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>
                    ) : (
                        <>
                            <Grid container spacing={3}>
                                {appointments.length === 0 ? (
                                    <Grid size={{ xs: 12 }}>
                                        <Card sx={{ p: 5, textAlign: 'center', borderRadius: 3, boxShadow: 'none', border: '1px solid #f0f0f0' }}>
                                            <Typography color="text.secondary" variant="body1">
                                                No appointments found for this day.
                                            </Typography>
                                        </Card>
                                    </Grid>
                                ) : (
                                    appointments.map((appointment: Appointment) => (
                                        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={appointment.id}>
                                            <PatientAppointmentCard
                                                appointment={appointment}
                                                onMenuOpen={handleMenuOpen}
                                            />
                                        </Grid>
                                    ))
                                )}
                            </Grid>

                            {totalPages > 1 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                    <Pagination
                                        count={totalPages}
                                        page={page}
                                        onChange={(_, value) => setPage(value)}
                                        color="primary"
                                        size="large"
                                        shape="rounded"
                                    />
                                </Box>
                            )}
                        </>
                    )}
                </Box>
            )}

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{ elevation: 3, sx: { borderRadius: 2, minWidth: 150, mt: 1 } }}
            >
                <MenuItem onClick={handleCancelClick} sx={{ color: COLORS.error.main }}>
                    Cancel Appointment
                </MenuItem>
            </Menu>

            <Dialog open={isCancelDialogOpen} onClose={() => setIsCancelDialogOpen(false)}>
                <DialogTitle>Cancel Appointment</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Are you sure you want to cancel this appointment? Please provide a reason (optional).
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Cancellation Reason"
                        type="text"
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsCancelDialogOpen(false)}>Back</Button>
                    <Button onClick={handleConfirmCancel} color="error" variant="contained" disableElevation>
                        Confirm Cancel
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    );
}
