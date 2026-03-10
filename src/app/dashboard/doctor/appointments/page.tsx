'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Pagination,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';

import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Role, AppointmentStatus, Appointment, OnsiteConsultation } from '@/lib/types';
import api from '@/lib/api';

// Sub-components
import AppointmentTabs from './components/AppointmentTabs';
import AppointmentFilters from './components/AppointmentFilters';
import DateCarousel from './components/DateCarousel';
import AppointmentCard from './components/AppointmentCard';
import OnsiteFilters from './components/OnsiteFilters';
import OnsiteConsultationCard from './components/OnsiteConsultationCard';
import NewOnsiteModal from './components/NewOnsiteModal';
import StatusUpdateMenu from './components/StatusUpdateMenu';

const navItems = [
    { label: 'Dashboard', href: '/dashboard/doctor', icon: <DashboardIcon /> },
    { label: 'Appointments', href: '/dashboard/doctor/appointments', icon: <EventIcon /> },
];

export default function DoctorAppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('Appointments');

    // Actions menu state
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedType, setSelectedType] = useState('All');

    // Onsite Consultation specific state
    const [onsiteConsultations, setOnsiteConsultations] = useState<OnsiteConsultation[]>([]);
    const [dateFilter, setDateFilter] = useState('past_6_months');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    // Onsite modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', phone: '', notes: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            if (activeTab === 'Appointments') {
                const dateStr = selectedDate.toLocaleDateString('en-CA');
                const queryParams = new URLSearchParams();
                queryParams.append('date', dateStr);
                queryParams.append('page', page.toString());
                queryParams.append('limit', '10'); // Limit set to 2 for testing
                if (selectedType && selectedType !== 'All') queryParams.append('type', selectedType);

                const res = await api.get<{ data: Appointment[], meta: any }>(`/appointments/doctor/me?${queryParams.toString()}`);
                const enrichedData = res.data.data.map(appt => ({
                    ...appt,
                    type: appt.type || 'Consultation'
                }));

                // No need to sort if backend sorts, but keeping it for safety
                const sorted = enrichedData.sort((a, b) => {
                    const dateA = new Date(`${a.appointmentDate}T${a.startTime}`);
                    const dateB = new Date(`${b.appointmentDate}T${b.startTime}`);
                    return dateA.getTime() - dateB.getTime();
                });

                setAppointments(sorted);
                setTotalPages(res.data.meta.totalPages || 1);
            } else {
                const queryParams = new URLSearchParams();
                queryParams.append('page', page.toString());
                queryParams.append('limit', limit.toString());
                if (dateFilter && dateFilter !== 'all') queryParams.append('dateFilter', dateFilter);

                const res = await api.get(`/onsite-consultations/doctor/me?${queryParams.toString()}`);
                setOnsiteConsultations(res.data.data);
                setTotalPages(res.data.meta.totalPages || 1);
            }
            setError('');
        } catch (err) {
            setError('Failed to load data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [selectedDate, selectedType, activeTab, page, dateFilter]);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, appointment: Appointment) => {
        setAnchorEl(event.currentTarget);
        setSelectedAppointment(appointment);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedAppointment(null);
    };

    const handleCreateOnsite = async () => {
        try {
            setIsSubmitting(true);
            await api.post('/onsite-consultations', formData);
            setIsModalOpen(false);
            setFormData({ firstName: '', lastName: '', phone: '', notes: '' });
            await fetchAppointments();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to create onsite consultation');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateStatus = async (status: AppointmentStatus) => {
        if (!selectedAppointment) return;
        try {
            await api.patch(`/appointments/${selectedAppointment.id}/status`, { status });
            await fetchAppointments();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to update status');
        }
        handleMenuClose();
    };

    return (
        <ProtectedRoute allowedRoles={[Role.DOCTOR]}>
            <DashboardLayout navItems={navItems} title="Appointments">

                {/* Header: Tabs and Filters */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, mb: 4, gap: 2 }}>
                    <AppointmentTabs activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setPage(1); }} />
                    {activeTab === 'Appointments' && (
                        <AppointmentFilters selectedType={selectedType} setSelectedType={setSelectedType} />
                    )}
                </Box>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                {activeTab === 'Appointments' ? (
                    <>
                        <DateCarousel
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            appointmentsCount={appointments.length}
                        />
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>
                        ) : (
                            <Grid container spacing={3}>
                                {appointments.length === 0 ? (
                                    <Grid size={{ xs: 12 }}>
                                        <Typography textAlign="center" color="text.secondary" py={4}>No appointments found for this view.</Typography>
                                    </Grid>
                                ) : (
                                    appointments.map(appt => (
                                        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={appt.id}>
                                            <AppointmentCard appointment={appt} onMenuOpen={handleMenuOpen} />
                                        </Grid>
                                    ))
                                )}
                            </Grid>
                        )}
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
                ) : (
                    <>
                        <OnsiteFilters
                            dateFilter={dateFilter}
                            setDateFilter={setDateFilter}
                            onNewConsultation={() => setIsModalOpen(true)}
                        />
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>
                        ) : (
                            <Box>
                                <Grid container spacing={3}>
                                    {onsiteConsultations.length === 0 ? (
                                        <Grid size={{ xs: 12 }}>
                                            <Typography textAlign="center" color="text.secondary" py={4}>No onsite consultations found for this time range.</Typography>
                                        </Grid>
                                    ) : (
                                        onsiteConsultations.map(consult => (
                                            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={consult.id}>
                                                <OnsiteConsultationCard consult={consult} />
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
                            </Box>
                        )}
                    </>
                )}

                <StatusUpdateMenu
                    anchorEl={anchorEl}
                    onClose={handleMenuClose}
                    onStatusUpdate={handleUpdateStatus}
                />

                <NewOnsiteModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleCreateOnsite}
                    isSubmitting={isSubmitting}
                />

            </DashboardLayout>
        </ProtectedRoute>
    );
}

