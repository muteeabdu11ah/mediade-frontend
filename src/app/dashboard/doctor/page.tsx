'use client';

import React from 'react';
import { Card, CardContent, Typography, Divider, List, ListItem, ListItemIcon, ListItemText, Box, Grid } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Role } from '@/lib/types';
import DoctorStatsCards from './components/DoctorStatsCards';
import DoctorDurationChart from './components/DoctorDurationChart';
import DoctorConsultationsChart from './components/DoctorConsultationsChart';

const recentActivity = [
    { title: 'Completed consultation', subtitle: 'Sarah Al-Rashid', time: '10 min ago', color: '#00BCD4' },
    { title: 'Prescription sent', subtitle: 'Mohammed Bin Saleh', time: '25 min ago', color: '#66BB6A' },
    { title: 'AI summary generated', subtitle: 'Fatima Al-Harbi', time: '1 hr ago', color: '#AB47BC' },
    { title: 'Appointment booked', subtitle: 'Noor Al-Dosari', time: '3 hr ago', color: '#78909C' },
];

export default function DoctorDashboard() {
    return (
        <ProtectedRoute allowedRoles={[Role.DOCTOR]}>
            <DashboardLayout title="Dashboard">

                {/* Top Stat Cards — fetches independently */}
                <DoctorStatsCards />

                {/* Charts Section — each fetches independently */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <DoctorDurationChart />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <DoctorConsultationsChart />
                    </Grid>
                </Grid>

                {/* Recent Activity — static placeholder */}
                <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #f0f0f0' }}>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h3" fontWeight={700} color="#1A2B3C" sx={{ mb: 2 }}>
                            Recent Activity
                        </Typography>
                        <List disablePadding>
                            {recentActivity.map((activity, index) => (
                                <React.Fragment key={index}>
                                    <ListItem alignItems="flex-start" sx={{ px: 0, py: 2 }}>
                                        <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                                            <FiberManualRecordIcon sx={{ fontSize: 14, color: activity.color }} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography variant="body2" fontWeight={600} color="#1A2B3C">
                                                    {activity.title}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography variant="caption" color="text.secondary">
                                                    {activity.subtitle}
                                                </Typography>
                                            }
                                        />
                                        <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
                                            {activity.time}
                                        </Typography>
                                    </ListItem>
                                    {index < recentActivity.length - 1 && <Divider sx={{ borderColor: '#f5f5f5' }} />}
                                </React.Fragment>
                            ))}
                        </List>
                    </CardContent>
                </Card>

            </DashboardLayout>
        </ProtectedRoute>
    );
}
