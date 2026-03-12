'use client';

import React, { useState } from 'react';
import {
    Card, CardContent, Box, Typography, FormControl, Select, MenuItem,
    TextField, Button, Popover, Dialog, DialogTitle, DialogContent, DialogActions,
    Skeleton, useMediaQuery, useTheme, Chip
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { useDoctorConsultationsChart } from '@/hooks/use-appointments';

type Timeframe = 'week' | 'month' | '6months' | 'year' | 'custom';

const TIMEFRAME_LABELS: Record<Timeframe, string> = {
    week: 'This Week',
    month: 'This Month',
    '6months': '6 Months',
    year: 'Year',
    custom: 'Date Range',
};

function BarChartSkeleton() {
    return (
        <Box sx={{ width: '10%', height: 260, display: 'flex', alignItems: 'flex-end', gap: 1.5, px: 1, pt: 2 }}>
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

export default function DoctorConsultationsChart() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [timeframe, setTimeframe] = useState<Timeframe>('6months');
    const [customRange, setCustomRange] = useState({ start: '', end: '' });
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Applied only after clicking "Apply"
    const [appliedCustomRange, setAppliedCustomRange] = useState({ start: '', end: '' });

    const { data: barChartData, isLoading } = useDoctorConsultationsChart(
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
                setAnchorEl(event.currentTarget?.closest?.('.MuiFormControl-root') || event.currentTarget);
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
        // Reset select if user cancels without applying
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
                inputProps={{ max: customRange.end || undefined }}
            />
            <TextField
                label="End Date"
                type="date"
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                value={customRange.end}
                onChange={(e) => setCustomRange(p => ({ ...p, end: e.target.value }))}
                inputProps={{ min: customRange.start || undefined }}
            />
        </Box>
    );

    return (
        <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #f0f0f0', height: '100%' }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>

                {/* Card Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        {isLoading ? (
                            <>
                                <Skeleton variant="text" width={160} height={28} />
                                <Skeleton variant="text" width={120} height={20} />
                            </>
                        ) : (
                            <>
                                <Typography variant="h6" fontWeight={700} color="#1A2B3C" noWrap>
                                    Total Consultations
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Consultations trend
                                    </Typography>
                                    {timeframe === 'custom' && appliedCustomRange.start && (
                                        <Chip
                                            label={`${appliedCustomRange.start} → ${appliedCustomRange.end}`}
                                            size="small"
                                            icon={<DateRangeIcon sx={{ fontSize: '14px !important' }} />}
                                            sx={{ fontSize: '0.65rem', height: 20, bgcolor: '#e1f5fe', color: '#0277bd' }}
                                        />
                                    )}
                                </Box>
                            </>
                        )}
                    </Box>

                    {/* Timeframe Select */}
                    <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 130 } }}>
                        <Select
                            value={timeframe}
                            onChange={handleTimeframeChange}
                            displayEmpty
                            sx={{
                                borderRadius: 2,
                                bgcolor: '#f8f9fa',
                                '& fieldset': { border: 'none' },
                                '.MuiSelect-select': {
                                    py: 0.75,
                                    px: 1.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    fontSize: '0.8rem',
                                    fontWeight: 500,
                                    color: 'text.secondary',
                                }
                            }}
                        >
                            <MenuItem value="week"><Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><CalendarTodayIcon sx={{ fontSize: 14 }} />Week</Box></MenuItem>
                            <MenuItem value="month"><Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><CalendarTodayIcon sx={{ fontSize: 14 }} />Month</Box></MenuItem>
                            <MenuItem value="6months"><Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><CalendarTodayIcon sx={{ fontSize: 14 }} />6 Months</Box></MenuItem>
                            <MenuItem value="year"><Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><CalendarTodayIcon sx={{ fontSize: 14 }} />Year</Box></MenuItem>
                            {/* <MenuItem value="custom"><Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><DateRangeIcon sx={{ fontSize: 14 }} />Date Range</Box></MenuItem> */}
                        </Select>
                    </FormControl>
                </Box>

                {/* Desktop Popover */}
                <Popover
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={handleCancelCustomRange}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', p: 2.5, minWidth: 280 } }}
                >
                    {dateRangeForm}
                    <Box sx={{ display: 'flex', gap: 1, mt: 2.5 }}>
                        <Button variant="outlined" size="small" onClick={handleCancelCustomRange}
                            sx={{ flex: 1, borderRadius: 2, borderColor: '#e0e0e0', color: 'text.secondary' }}>
                            Cancel
                        </Button>
                        <Button variant="contained" size="small" onClick={handleApplyCustomRange}
                            disabled={!customRange.start || !customRange.end}
                            sx={{ flex: 1, bgcolor: '#1fb2ba', '&:hover': { bgcolor: '#1a9a9d' }, borderRadius: 2 }}>
                            Apply
                        </Button>
                    </Box>
                </Popover>

                {/* Mobile Dialog */}
                <Dialog
                    open={mobileOpen}
                    onClose={handleCancelCustomRange}
                    fullScreen={isMobile}
                    maxWidth="xs"
                    fullWidth
                    PaperProps={{ sx: { borderRadius: isMobile ? 0 : 3 } }}
                >
                    <DialogTitle sx={{ fontWeight: 700, color: '#1A2B3C', pb: 0 }}>
                        Custom Date Range
                    </DialogTitle>
                    <DialogContent sx={{ pt: 2 }}>
                        {dateRangeForm}
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                        <Button onClick={handleCancelCustomRange} variant="outlined"
                            sx={{ flex: 1, borderRadius: 2, borderColor: '#e0e0e0', color: 'text.secondary' }}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleApplyCustomRange}
                            variant="contained"
                            disabled={!customRange.start || !customRange.end}
                            sx={{ flex: 1, bgcolor: '#1fb2ba', '&:hover': { bgcolor: '#1a9a9d' }, borderRadius: 2 }}
                        >
                            Apply
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Chart */}
                {isLoading ? (
                    <BarChartSkeleton />
                ) : (
                    <Box sx={{ width: '100%', height: 260 }}>
                        <ResponsiveContainer>
                            <BarChart data={barChartData || []} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barSize={32}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8f9da9' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8f9da9' }} ticks={[0, 25, 50, 75, 100]} />
                                <RechartsTooltip cursor={{ fill: '#f8f9fa' }} />
                                <Bar dataKey="value" fill="#29B6F6" radius={[4, 4, 0, 0]}>
                                    {(barChartData || []).map((entry, index) => (
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
