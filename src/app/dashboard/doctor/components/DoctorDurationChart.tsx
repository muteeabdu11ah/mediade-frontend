'use client';

import React from 'react';
import { Card, CardContent, Box, Typography, Skeleton } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { useDoctorDurationChart } from '@/hooks/use-appointments';

function ChartSkeleton() {
    return (
        <Box sx={{ width: '100%', height: 260, pt: 1 }}>
            {/* Fake axis lines */}
            <Box sx={{ display: 'flex', gap: 1, mb: 1, px: 1 }}>
                {[40, 65, 30, 80, 55, 70, 20].map((h, i) => (
                    <Skeleton
                        key={i}
                        variant="rectangular"
                        width="100%"
                        height={h * 2.8}
                        sx={{ borderRadius: '4px 4px 0 0', alignSelf: 'flex-end' }}
                    />
                ))}
            </Box>
            <Skeleton variant="text" width="100%" height={16} sx={{ mt: 0.5 }} />
        </Box>
    );
}

export default function DoctorDurationChart() {
    const { data: areaChartData, isLoading } = useDoctorDurationChart();

    return (
        <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #f0f0f0', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box>
                        {isLoading ? (
                            <>
                                <Skeleton variant="text" width={160} height={28} />
                                <Skeleton variant="text" width={120} height={20} />
                            </>
                        ) : (
                            <>
                                <Typography variant="h6" fontWeight={700} color="#1A2B3C">
                                    Consultation Duration
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Average minutes per day
                                </Typography>
                            </>
                        )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f8f9fa', px: 1.5, py: 0.5, borderRadius: 2 }}>
                        <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>This Week</Typography>
                    </Box>
                </Box>

                {isLoading ? (
                    <ChartSkeleton />
                ) : (
                    <Box sx={{ width: '100%', height: 260 }}>
                        <ResponsiveContainer>
                            <AreaChart data={areaChartData || []} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorValueDuration" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1fb2ba" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#1fb2ba" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8f9da9' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8f9da9' }} ticks={[0, 8, 16, 24, 32]} />
                                <RechartsTooltip />
                                <Area type="monotone" dataKey="value" stroke="#1fb2ba" strokeWidth={3} fillOpacity={1} fill="url(#colorValueDuration)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}
