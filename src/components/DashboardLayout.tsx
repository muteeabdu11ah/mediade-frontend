'use client';

import React, { useState } from 'react';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    Divider,
    useMediaQuery,
    useTheme,
    Chip,
    Menu,
    MenuItem,
    Badge,
    InputBase,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Role } from '@/lib/types';

const DRAWER_WIDTH = 260;

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

interface DashboardLayoutProps {
    children: React.ReactNode;
    navItems: NavItem[];
    title: string;
}

const roleColors: Record<string, string> = {
    [Role.SUPER_ADMIN]: '#EF5350',
    [Role.CLINIC_ADMIN]: '#AB47BC',
    [Role.DOCTOR]: '#42A5F5',
    [Role.RECEPTIONIST]: '#FFA726',
    [Role.PATIENT]: '#66BB6A',
};

const roleLabels: Record<string, string> = {
    [Role.SUPER_ADMIN]: 'Super Admin',
    [Role.CLINIC_ADMIN]: 'Clinic Admin',
    [Role.DOCTOR]: 'Doctor',
    [Role.RECEPTIONIST]: 'Receptionist',
    [Role.PATIENT]: 'Patient',
};

export default function DashboardLayout({ children, navItems, title }: DashboardLayoutProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Brand */}
            <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Box sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                    <LocalHospitalIcon sx={{ fontSize: 36 }} />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 800,
                            fontSize: '1.4rem',
                            color: 'primary.main',
                            lineHeight: 1.1,
                            letterSpacing: '-0.5px'
                        }}
                    >
                        MedAide
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: '0.45rem', fontWeight: 700, letterSpacing: '1px', color: 'text.secondary', textTransform: 'uppercase' }}>
                        Listen. Note. Care.
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ borderColor: 'rgba(0,188,212,0.08)' }} />

            {/* Navigation */}
            <List sx={{ px: 1.5, py: 2, flex: 1 }}>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                component={Link}
                                href={item.href}
                                onClick={() => isMobile && setMobileOpen(false)}
                                sx={{
                                    borderRadius: 2,
                                    px: 2,
                                    py: 1.2,
                                    bgcolor: isActive ? 'primary.main' : 'transparent',
                                    color: isActive ? 'white' : 'text.secondary',
                                    '&:hover': {
                                        bgcolor: isActive ? 'primary.main' : 'rgba(31,178,186,0.08)',
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 40,
                                        color: isActive ? 'white' : 'text.secondary',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? 600 : 500,
                                        fontSize: '0.95rem',
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            {/* User Info */}
            {user && (
                <Box sx={{ p: 2 }}>
                    <Divider sx={{ mb: 2, borderColor: 'rgba(0,188,212,0.08)' }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                            sx={{
                                width: 40,
                                height: 40,
                                bgcolor: roleColors[user.role] || 'primary.main',
                                fontSize: '0.875rem',
                                fontWeight: 700,
                            }}
                        >
                            {user.firstName[0]}{user.lastName[0]}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" fontWeight={600} noWrap>
                                {user.firstName} {user.lastName}
                            </Typography>
                            <Chip
                                label={roleLabels[user.role] || user.role}
                                size="small"
                                sx={{
                                    height: 20,
                                    fontSize: '0.65rem',
                                    fontWeight: 600,
                                    bgcolor: `${roleColors[user.role]}14`,
                                    color: roleColors[user.role],
                                    mt: 0.5,
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F5FFFE' }}>
            {/* Sidebar */}
            <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
                {isMobile ? (
                    <Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onClose={() => setMobileOpen(false)}
                        ModalProps={{ keepMounted: true }}
                        PaperProps={{
                            sx: {
                                width: DRAWER_WIDTH,
                                bgcolor: '#FFFFFF',
                                borderRight: '1px solid rgba(0,188,212,0.08)',
                            },
                        }}
                    >
                        {drawerContent}
                    </Drawer>
                ) : (
                    <Drawer
                        variant="permanent"
                        sx={{
                            display: { xs: 'none', md: 'block' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
                        }}
                        PaperProps={{
                            sx: {
                                width: DRAWER_WIDTH,
                                bgcolor: '#FFFFFF',
                                borderRight: '1px solid rgba(0,188,212,0.08)',
                            },
                        }}
                    >
                        {drawerContent}
                    </Drawer>
                )}
            </Box>

            {/* Main Content */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {/* Top Bar */}
                <AppBar
                    position="sticky"
                    elevation={0}
                    sx={{
                        bgcolor: 'rgba(245,255,254,0.9)',
                        backdropFilter: 'blur(20px)',
                        borderBottom: '1px solid rgba(0,188,212,0.08)',
                        color: 'text.primary',
                    }}
                >
                    <Toolbar sx={{ py: 1 }}>
                        {isMobile && (
                            <IconButton onClick={() => setMobileOpen(true)} sx={{ mr: 1 }}>
                                <MenuIcon />
                            </IconButton>
                        )}
                        <Typography variant="h5" fontWeight={700} sx={{ flex: 1, color: '#1A2B3C' }}>
                            {title}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {/* Search Bar */}
                            <Box sx={{
                                display: { xs: 'none', md: 'flex' },
                                alignItems: 'center',
                                bgcolor: '#F5F7FA',
                                borderRadius: 8,
                                px: 2,
                                py: 0.75,
                                width: { md: 240, lg: 320 },
                            }}>
                                <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                <InputBase
                                    placeholder="Search..."
                                    sx={{ ml: 1, flex: 1, fontSize: '0.9rem' }}
                                />
                            </Box>

                            {/* Notifications */}
                            <IconButton sx={{ color: 'text.secondary' }}>
                                <Badge color="error" variant="dot">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>

                            <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5, height: 32, alignSelf: 'center' }} />

                            {/* User Profile */}
                            {user && (
                                <>
                                    <Box
                                        onClick={(e) => setAnchorEl(e.currentTarget)}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1.5,
                                            cursor: 'pointer',
                                            py: 0.5,
                                            px: 1,
                                            borderRadius: 2,
                                            '&:hover': { bgcolor: 'rgba(31,178,186,0.04)' },
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                bgcolor: 'primary.main',
                                                fontSize: '0.9rem',
                                                fontWeight: 700,
                                            }}
                                        >
                                            {user.firstName[0]}
                                        </Avatar>
                                        {!isMobile && (
                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                                                    Dr. {user.firstName} {user.lastName}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                                    {user.role === Role.DOCTOR ? 'Cardiologist' : roleLabels[user.role]}
                                                </Typography>
                                            </Box>
                                        )}
                                        <KeyboardArrowDownIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                                    </Box>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={() => setAnchorEl(null)}
                                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                        slotProps={{
                                            paper: {
                                                sx: {
                                                    mt: 1,
                                                    minWidth: 180,
                                                    boxShadow: '0 8px 32px rgba(0,188,212,0.16)',
                                                },
                                            },
                                        }}
                                    >
                                        <MenuItem component={Link} href="/profile" onClick={() => setAnchorEl(null)}>
                                            <PersonIcon fontSize="small" sx={{ mr: 1.5, color: 'primary.main' }} />
                                            Profile
                                        </MenuItem>
                                        {user.role === Role.DOCTOR && (
                                            <MenuItem component={Link} href="/dashboard/doctor/schedule" onClick={() => setAnchorEl(null)}>
                                                <CalendarMonthIcon fontSize="small" sx={{ mr: 1.5, color: 'primary.main' }} />
                                                My Schedule
                                            </MenuItem>
                                        )}
                                        <Divider />
                                        <MenuItem onClick={logout}>
                                            <LogoutIcon fontSize="small" sx={{ mr: 1.5, color: 'error.main' }} />
                                            Logout
                                        </MenuItem>
                                    </Menu>
                                </>
                            )}
                        </Box>
                    </Toolbar>
                </AppBar>

                {/* Page Content */}
                <Box sx={{ flex: 1, p: { xs: 2, sm: 3 } }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}
