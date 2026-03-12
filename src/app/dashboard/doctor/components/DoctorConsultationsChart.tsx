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

import { COLORS, BORDER_RADIUS, SHADOWS, GRADIENTS } from '@/lib/constants/design-tokens';

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
        <Box sx={{ width: '100%', height: 260, display: 'flex', alignItems: 'flex-end', gap: 1.5, px: 1, pt: 2 }}>
            {[55, 75, 40, 90, 60, 80, 45, 95, 70, 50, 85, 65].map((h, i) => (
                <Skeleton
                    key={i}
                    variant="rectangular"
                    width="100%"
                    height={`${h}%`}
                    sx={{ borderRadius: BORDER_RADIUS.sm, flexShrink: 0, minWidth: 0 }}
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: COLORS.text.primary }}>
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
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: BORDER_RADIUS.md,
                        bgcolor: COLORS.background.subtle
                    }
                }}
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
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: BORDER_RADIUS.md,
                        bgcolor: COLORS.background.subtle
                    }
                }}
            />
        </Box>
    );

    return (
        <Card sx={{ height: '100%', overflow: 'visible' }}>
            <CardContent sx={{ p: { xs: 2, sm: 4 } }}>

                {/* Card Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        {isLoading ? (
                            <>
                                <Skeleton variant="text" width={160} height={28} />
                                <Skeleton variant="text" width={120} height={20} />
                            </>
                        ) : (
                            <>
                                <Typography variant="h3" sx={{ fontWeight: 900, color: COLORS.text.primary, mb: 0.5 }} noWrap>
                                    Total Consultations
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                                    <Typography variant="body2" sx={{ color: COLORS.text.muted, fontWeight: 600 }}>
                                        Consultations trend
                                    </Typography>
                                    {timeframe === 'custom' && appliedCustomRange.start && (
                                        <Chip
                                            label={`${appliedCustomRange.start} → ${appliedCustomRange.end}`}
                                            size="small"
                                            icon={<DateRangeIcon sx={{ fontSize: '14px !important' }} />}
                                            sx={{
                                                fontSize: '0.7rem',
                                                height: 24,
                                                bgcolor: COLORS.info.subtle,
                                                color: COLORS.info.main,
                                                fontWeight: 700,
                                                borderRadius: BORDER_RADIUS.sm,
                                                border: `1px solid ${COLORS.info.main}22`
                                            }}
                                        />
                                    )}
                                </Box>
                            </>
                        )}
                    </Box>

                    {/* Timeframe Select */}
                    <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
                        <Select
                            value={timeframe}
                            onChange={handleTimeframeChange}
                            displayEmpty
                            sx={{
                                borderRadius: BORDER_RADIUS.md,
                                bgcolor: COLORS.background.subtle,
                                border: `1px solid ${COLORS.border.light}`,
                                '& fieldset': { border: 'none' },
                                '.MuiSelect-select': {
                                    py: 1,
                                    px: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    fontSize: '0.85rem',
                                    fontWeight: 700,
                                    color: COLORS.text.primary,
                                }
                            }}
                        >
                            <MenuItem value="week"><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><CalendarTodayIcon sx={{ fontSize: 16, color: COLORS.primary.main }} />Week</Box></MenuItem>
                            <MenuItem value="month"><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><CalendarTodayIcon sx={{ fontSize: 16, color: COLORS.primary.main }} />Month</Box></MenuItem>
                            <MenuItem value="6months"><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><CalendarTodayIcon sx={{ fontSize: 16, color: COLORS.primary.main }} />6 Months</Box></MenuItem>
                            <MenuItem value="year"><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><CalendarTodayIcon sx={{ fontSize: 16, color: COLORS.primary.main }} />Year</Box></MenuItem>
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
                    PaperProps={{
                        sx: {
                            borderRadius: BORDER_RADIUS.lg,
                            boxShadow: SHADOWS.premium,
                            p: 3,
                            minWidth: 320,
                            border: `1px solid ${COLORS.border.light}`,
                            mt: 1
                        }
                    }}
                >
                    {dateRangeForm}
                    <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleCancelCustomRange}
                            sx={{
                                flex: 1,
                                borderRadius: BORDER_RADIUS.md,
                                fontWeight: 700,
                                color: COLORS.text.secondary
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleApplyCustomRange}
                            disabled={!customRange.start || !customRange.end}
                            sx={{
                                flex: 1,
                                background: GRADIENTS.primary,
                                borderRadius: BORDER_RADIUS.md,
                                fontWeight: 800,
                                boxShadow: SHADOWS.medium
                            }}
                        >
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
                    PaperProps={{
                        sx: {
                            borderRadius: isMobile ? 0 : BORDER_RADIUS.lg,
                            overflow: 'hidden'
                        }
                    }}
                >
                    <DialogTitle sx={{ fontWeight: 900, color: COLORS.text.primary, pt: 3, pb: 2, letterSpacing: '-0.5px' }}>
                        Custom Date Range
                    </DialogTitle>
                    <DialogContent sx={{ pt: 1 }}>
                        {dateRangeForm}
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 4, pt: 2, gap: 2 }}>
                        <Button
                            onClick={handleCancelCustomRange}
                            variant="outlined"
                            sx={{ flex: 1, borderRadius: BORDER_RADIUS.md, py: 1.2, fontWeight: 700 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleApplyCustomRange}
                            variant="contained"
                            disabled={!customRange.start || !customRange.end}
                            sx={{
                                flex: 1,
                                background: GRADIENTS.primary,
                                borderRadius: BORDER_RADIUS.md,
                                py: 1.2,
                                fontWeight: 800,
                                boxShadow: SHADOWS.medium
                            }}
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
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.border.light} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: COLORS.text.muted, fontWeight: 700 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: COLORS.text.muted, fontWeight: 700 }}
                                    ticks={[0, 25, 50, 75, 100]}
                                />
                                <RechartsTooltip
                                    cursor={{ fill: COLORS.background.subtle, radius: 4 }}
                                    contentStyle={{
                                        borderRadius: BORDER_RADIUS.md,
                                        border: `1px solid ${COLORS.border.light}`,
                                        boxShadow: SHADOWS.medium,
                                        fontWeight: 700
                                    }}
                                />
                                <Bar dataKey="value" fill={COLORS.primary.main} radius={[6, 6, 0, 0]}>
                                    {(barChartData || []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS.primary.main} opacity={0.8 + (index / barChartData!.length) * 0.2} />
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
