'use client';

import React from 'react';
import { Card, CardContent, Box, Typography, Skeleton } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { useDoctorDurationChart } from '@/hooks/use-appointments';
import { COLORS, BORDER_RADIUS, SHADOWS, GRADIENTS } from '@/lib/constants/design-tokens';

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
                        sx={{ borderRadius: BORDER_RADIUS.sm, alignSelf: 'flex-end' }}
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
        <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                    <Box>
                        {isLoading ? (
                            <>
                                <Skeleton variant="text" width={160} height={28} />
                                <Skeleton variant="text" width={120} height={20} />
                            </>
                        ) : (
                            <>
                                <Typography variant="h3" sx={{ fontWeight: 800, color: COLORS.text.primary }}>
                                    Consultation Duration
                                </Typography>
                                <Typography variant="body2" sx={{ color: COLORS.text.muted, fontWeight: 600 }}>
                                    Average minutes per day
                                </Typography>
                            </>
                        )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: COLORS.background.subtle, px: 2, py: 0.8, borderRadius: BORDER_RADIUS.md, border: `1px solid ${COLORS.border.light}` }}>
                        <AccessTimeIcon sx={{ fontSize: 16, mr: 0.8, color: COLORS.primary.main }} />
                        <Typography variant="caption" sx={{ color: COLORS.text.primary, fontWeight: 700 }}>This Week</Typography>
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
                                        <stop offset="5%" stopColor={COLORS.primary.main} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={COLORS.primary.main} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.border.light} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: COLORS.text.muted, fontWeight: 600 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: COLORS.text.muted, fontWeight: 600 }}
                                    ticks={[0, 8, 16, 24, 32]}
                                />
                                <RechartsTooltip
                                    contentStyle={{
                                        borderRadius: BORDER_RADIUS.md,
                                        border: `1px solid ${COLORS.border.light}`,
                                        boxShadow: SHADOWS.medium
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={COLORS.primary.main}
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorValueDuration)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}
