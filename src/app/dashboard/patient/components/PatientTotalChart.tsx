'use client';

import React, { useState } from 'react';
import { Card, CardContent, Box, Typography, FormControl, Select, MenuItem, Skeleton, useTheme, useMediaQuery, Popover, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Chip } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { usePatientTotalChart } from '@/hooks/use-appointments';

type Timeframe = 'week' | 'month' | '6months' | 'year' | 'custom';

function BarChartSkeleton() {
    return (
        <Box sx={{ width: '8%', height: 260, display: 'flex', alignItems: 'flex-end', gap: 1.5, px: 1, pt: 2 }}>
            {[55, 75, 40, 90, 60, 80, 45, 95, 70, 50, 85, 65].map((h, i) => (
                <Skeleton
                    key={i}
                    variant="rectangular"
                    width="100%"
                    height={`${h}%`}
                    sx={{ borderRadius: '4px 4px 0 0', flexShrink: 0, minWidth: 0 }}
                />
            ))}
        </Box>
    );
}

export default function PatientTotalChart() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [timeframe, setTimeframe] = useState<Timeframe>('6months');
    const [customRange, setCustomRange] = useState({ start: '', end: '' });
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    const [appliedCustomRange, setAppliedCustomRange] = useState({ start: '', end: '' });

    const { data: chartData, isLoading } = usePatientTotalChart(
        timeframe,
        timeframe === 'custom' ? appliedCustomRange.start : undefined,
        timeframe === 'custom' ? appliedCustomRange.end : undefined
    );

    const handleTimeframeChange = (event: any) => {
        const val = event.target.value as Timeframe;
        if (val === 'custom') {
            if (isMobile) {
                setMobileOpen(true);
            } else {
                setAnchorEl(event.currentTarget);
            }
        } else {
            setTimeframe(val);
        }
    };

    const handleApplyCustomRange = () => {
        if (customRange.start && customRange.end) {
            setAppliedCustomRange(customRange);
            setTimeframe('custom');
            setAnchorEl(null);
            setMobileOpen(false);
        }
    };

    const handleCancelCustomRange = () => {
        setAnchorEl(null);
        setMobileOpen(false);
        if (appliedCustomRange.start === '') {
            setTimeframe('6months');
        }
    };

    const dateRangeForm = (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} color="#1A2B3C">
                Select Custom Date Range
            </Typography>
            <TextField
                label="Start Date"
                type="date"
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                value={customRange.start}
                onChange={(e) => setCustomRange(p => ({ ...p, start: e.target.value }))}
            />
            <TextField
                label="End Date"
                type="date"
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                value={customRange.end}
                onChange={(e) => setCustomRange(p => ({ ...p, end: e.target.value }))}
            />
        </Box>
    );

    return (
        <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #f0f0f0', height: '100%' }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h6" fontWeight={700} color="#1A2B3C" noWrap>
                            Total Appointments
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography variant="body2" color="text.secondary">
                                Appointment trend
                            </Typography>
                            {timeframe === 'custom' && appliedCustomRange.start && (
                                <Chip
                                    label={`${appliedCustomRange.start} → ${appliedCustomRange.end}`}
                                    size="small"
                                    icon={<DateRangeIcon sx={{ fontSize: '14px !important' }} />}
                                    sx={{ fontSize: '0.65rem', height: 20 }}
                                />
                            )}
                        </Box>
                    </Box>

                    <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 130 } }}>
                        <Select
                            value={timeframe}
                            onChange={handleTimeframeChange}
                            sx={{
                                borderRadius: 2,
                                bgcolor: '#f8f9fa',
                                '& fieldset': { border: 'none' },
                                '.MuiSelect-select': { py: 0.75, px: 1.5, display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.8rem', fontWeight: 500, color: 'text.secondary' }
                            }}
                        >
                            <MenuItem value="week">Week</MenuItem>
                            <MenuItem value="month">Month</MenuItem>
                            <MenuItem value="6months">6 Months</MenuItem>
                            <MenuItem value="year">Year</MenuItem>
                            {/* <MenuItem value="custom">More Options</MenuItem> */}
                        </Select>
                    </FormControl>
                </Box>

                <Popover
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={handleCancelCustomRange}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    PaperProps={{ sx: { p: 2, minWidth: 280 } }}
                >
                    {dateRangeForm}
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <Button variant="outlined" fullWidth onClick={handleCancelCustomRange}>Cancel</Button>
                        <Button variant="contained" fullWidth onClick={handleApplyCustomRange} color="primary">Apply</Button>
                    </Box>
                </Popover>

                <Dialog open={mobileOpen} onClose={handleCancelCustomRange} fullWidth maxWidth="xs">
                    <DialogTitle>Custom Date Range</DialogTitle>
                    <DialogContent>{dateRangeForm}</DialogContent>
                    <DialogActions>
                        <Button onClick={handleCancelCustomRange}>Cancel</Button>
                        <Button onClick={handleApplyCustomRange} variant="contained">Apply</Button>
                    </DialogActions>
                </Dialog>

                {isLoading ? (
                    <BarChartSkeleton />
                ) : (
                    <Box sx={{ width: '100%', height: 260 }}>
                        <ResponsiveContainer>
                            <BarChart data={chartData || []} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barSize={32}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8f9da9' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8f9da9' }} />
                                <RechartsTooltip cursor={{ fill: '#f8f9fa' }} />
                                <Bar dataKey="value" fill="#29B6F6" radius={[4, 4, 0, 0]}>
                                    {chartData?.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill="#29B6F6" />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}
