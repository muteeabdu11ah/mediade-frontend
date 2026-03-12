'use client';

import React from 'react';
import { Card, CardContent, Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, Button, Skeleton } from '@mui/material';
import { usePatientUpcomingList } from '@/hooks/use-appointments';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Link from 'next/link';

function UpcomingSkeleton() {
    return (
        <Box sx={{ p: 2 }}>
            {[0, 1, 2].map((i) => (
                <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Skeleton variant="circular" width={48} height={48} />
                    <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="text" width="40%" />
                    </Box>
                </Box>
            ))}
        </Box>
    );
}

export default function PatientUpcomingList() {
    const { data: upcoming, isLoading } = usePatientUpcomingList(3);

    return (
        <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #f0f0f0', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h3" fontWeight={700} color="#1A2B3C">
                        Upcoming Appointments
                    </Typography>
                    <Link href="/dashboard/patient/appointments" style={{ textDecoration: 'none' }}>
                        <Typography variant="caption" sx={{ color: '#00BCD4', fontWeight: 600, cursor: 'pointer' }}>
                            View All &gt;
                        </Typography>
                    </Link>
                </Box>

                {isLoading ? (
                    <UpcomingSkeleton />
                ) : upcoming?.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body2" color="text.secondary">No upcoming appointments</Typography>
                    </Box>
                ) : (
                    <List disablePadding>
                        {upcoming?.map((appt, index) => (
                            <React.Fragment key={appt.id}>
                                <ListItem alignItems="flex-start" sx={{ px: 0, py: 2 }}>
                                    <ListItemAvatar>
                                        <Avatar
                                            src={appt.profileImageUrl || ''}
                                            sx={{ width: 48, height: 48, borderRadius: 2 }}
                                        >
                                            {appt.doctorName[0]}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body2" fontWeight={700} color="#1A2B3C">
                                                {appt.doctorName}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="caption" color="text.secondary">
                                                {appt.specialty}
                                            </Typography>
                                        }
                                    />
                                    <Box sx={{ textAlign: 'right', minWidth: 80 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end', mb: 0.5 }}>
                                            <CalendarTodayIcon sx={{ fontSize: 12, color: '#00BCD4' }} />
                                            <Typography variant="caption" fontWeight={700} color={appt.isToday ? '#00BCD4' : 'text.primary'}>
                                                {appt.isToday ? 'Today' : new Date(appt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
                                            <AccessTimeIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                                            <Typography variant="caption" color="text.secondary">
                                                {appt.startTime}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </ListItem>
                                {index < upcoming.length - 1 && <Divider component="li" sx={{ borderColor: '#f5f5f5' }} />}
                            </React.Fragment>
                        ))}
                    </List>
                )}
            </CardContent>
        </Card>
    );
}
