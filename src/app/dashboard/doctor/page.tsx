'use client';

import React from 'react';
import { Typography, Grid, Card, CardContent, Box, Avatar, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import SettingsIcon from '@mui/icons-material/Settings';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Role } from '@/lib/types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, Cell } from 'recharts';

const statCards = [
    { title: "Today's Appointments", value: '12', trend: '+2 vs yesterday', icon: <CalendarTodayIcon sx={{ fontSize: 20 }} />, color: '#00BCD4' },
    { title: "Upcoming Appointments", value: '12', trend: '+2 vs yesterday', icon: <CalendarTodayIcon sx={{ fontSize: 20 }} />, color: '#42A5F5' },
    { title: "Completed Appointments", value: '12', trend: '+2 vs yesterday', icon: <CheckCircleOutlineIcon sx={{ fontSize: 20 }} />, color: '#66BB6A' },
];

const areaChartData = [
    { name: 'Mon', value: 22 },
    { name: 'Tue', value: 28 },
    { name: 'Wed', value: 18 },
    { name: 'Thu', value: 32 },
    { name: 'Fri', value: 25 },
    { name: 'Sat', value: 15 },
    { name: 'Sun', value: 0 },
];

const barChartData = [
    { name: 'Jan', value: 45 },
    { name: 'Feb', value: 52 },
    { name: 'Mar', value: 60 },
    { name: 'Apr', value: 58 },
    { name: 'May', value: 72 },
    { name: 'Jun', value: 85 },
];

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

                {/* Top Stat Cards */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    {statCards.map((card, index) => (
                        <Grid size={{ xs: 12, md: 4 }} key={index}>
                            <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #f0f0f0' }}>
                                <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                            {card.title}
                                        </Typography>
                                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#f5fbfe', color: '#1fb2ba', border: '1px solid #e1f5fe' }}>
                                            {card.icon}
                                        </Avatar>
                                    </Box>
                                    <Typography variant="h4" fontWeight={800} color="#1A2B3C">
                                        {card.value}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <TrendingUpIcon sx={{ fontSize: 16, color: '#66BB6A' }} />
                                        <Typography variant="caption" sx={{ color: '#66BB6A', fontWeight: 600 }}>+2</Typography>
                                        <Typography variant="caption" color="text.secondary"> vs yesterday</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Charts Section */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #f0f0f0', height: '100%' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Box>
                                        <Typography variant="h6" fontWeight={700} color="#1A2B3C">
                                            Consultation Duration
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Average minutes per day
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f8f9fa', px: 1.5, py: 0.5, borderRadius: 2 }}>
                                        <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                                        <Typography variant="caption" color="text.secondary" fontWeight={500}>This Week</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ width: '100%', height: 260 }}>
                                    <ResponsiveContainer>
                                        <AreaChart data={areaChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#1fb2ba" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#1fb2ba" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8f9da9' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8f9da9' }} ticks={[0, 8, 16, 24, 32]} />
                                            <RechartsTooltip />
                                            <Area type="monotone" dataKey="value" stroke="#1fb2ba" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #f0f0f0', height: '100%' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Box>
                                        <Typography variant="h6" fontWeight={700} color="#1A2B3C">
                                            Total Consultations
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Consultations trend
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f8f9fa', px: 1.5, py: 0.5, borderRadius: 2 }}>
                                        <CalendarTodayIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                                        <Typography variant="caption" color="text.secondary" fontWeight={500}>6 Months</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ width: '100%', height: 260 }}>
                                    <ResponsiveContainer>
                                        <BarChart data={barChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barSize={32}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8f9da9' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8f9da9' }} ticks={[0, 25, 50, 75, 100]} />
                                            <RechartsTooltip cursor={{ fill: '#f8f9fa' }} />
                                            <Bar dataKey="value" fill="#29B6F6" radius={[4, 4, 0, 0]}>
                                                {barChartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill="#29B6F6" />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Recent Activity */}
                <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #f0f0f0' }}>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={700} color="#1A2B3C" sx={{ mb: 2 }}>
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
