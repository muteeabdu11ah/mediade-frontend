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
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Role } from '@/lib/types';
import { getNavItemsByRole } from '@/lib/constants/navigation';
import Image from 'next/image';
import GridViewIcon from '@mui/icons-material/GridView';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

const DRAWER_WIDTH = 320;

interface DashboardLayoutProps {
    children: React.ReactNode;
    title: string;
}

const roleColors: Record<string, string> = {
    [Role.SUPER_ADMIN]: '#EF5350',
    [Role.CLINIC_ADMIN]: '#AB47BC',
    [Role.DOCTOR]: '#1fb2ba',
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

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const navItems = user ? getNavItemsByRole(user.role) : [];

    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'white' }}
        >
            {/* Brand */}
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Image
                    src="/logo.svg"
                    alt="Medaide Logo"
                    width={180}
                    height={60}
                    priority
                    style={{ objectFit: 'contain' }}
                />
            </Box>

            {/* Navigation */}
            <List sx={{ px: 2, flex: 1 }}>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <ListItem key={item.href} disablePadding sx={{ mb: 1.5 }}>
                            <ListItemButton
                                component={Link}
                                href={item.href}
                                onClick={() => isMobile && setMobileOpen(false)}
                                sx={{
                                    borderRadius: 2,
                                    px: 2.5,
                                    py: 1.5,
                                    background: isActive ? 'linear-gradient(135deg, #2EC2C9 0%, #35C8C8 100%)' : 'transparent',
                                    color: isActive ? 'white' : '#64748B',
                                    transition: 'all 0.2s',
                                    boxShadow: isActive ? '0 4px 12px rgba(46, 194, 201, 0.3)' : 'none',
                                    '&:hover': {
                                        background: isActive ? 'linear-gradient(135deg, #2EC2C9 0%, #35C8C8 100%)' : 'rgba(46, 194, 201, 0.05)',
                                        color: isActive ? 'white' : '#1fb2ba',
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 42,
                                        color: 'inherit',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? 700 : 500,
                                        fontSize: '1rem',
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            {/* Logout Section */}
            <Box sx={{ p: 2.5, borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={logout}
                        sx={{
                            borderRadius: 3,
                            px: 2.5,
                            py: 1.5,
                            color: '#64748B',
                            '&:hover': {
                                bgcolor: 'rgba(239,83,80,0.05)',
                                color: 'error.main',
                                '& .MuiListItemIcon-root': { color: 'error.main' }
                            },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 42, color: 'inherit' }}>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '1rem', fontWeight: 600 }} />
                    </ListItemButton>
                </ListItem>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Sidebar */}
            <Box component="nav" sx={{ width: { md: DRAWER_WIDTH + 32 }, flexShrink: { md: 0 } }}>
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
                                borderRight: 'none',
                                boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
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
                            '& .MuiDrawer-paper': {
                                boxSizing: 'border-box',
                                width: DRAWER_WIDTH,
                                borderRight: 'none',
                                bgcolor: 'transparent',
                            },
                        }}
                        open
                    >
                        <Box sx={{ p: 2, height: '100%' }}>
                            <Box sx={{
                                height: '100%',
                                bgcolor: 'white',
                                borderRadius: 2,
                                boxShadow: '0 4px 24px rgba(0,0,0,0.02)',
                                overflow: 'hidden',
                                border: '2px solid #2f96ca3b'
                            }}>
                                {drawerContent}
                            </Box>
                        </Box>
                    </Drawer>
                )}
            </Box>

            {/* Main Content */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflow: 'hidden' }}>
                <Box sx={{ py: 2, pr: 2, pl: 0, pb: 0 }}>
                    <AppBar
                        position="static"
                        elevation={0}
                        sx={{
                            bgcolor: 'white',
                            borderRadius: 1,
                            border: 'none',
                            color: 'text.primary',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                        }}
                    >
                        <Toolbar sx={{ py: 1.5, pr: { xs: 1, sm: 2 }, pl: 0 }}>
                            {isMobile && (
                                <IconButton onClick={() => setMobileOpen(true)} sx={{ mr: 1 }}>
                                    <MenuIcon />
                                </IconButton>
                            )}
                            <Typography variant="h6" fontWeight={700} sx={{ flex: 1, color: '#1A2B3C', fontSize: '1.25rem' }}>
                                {title}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                {/* Notifications */}
                                <IconButton sx={{ color: '#64748B' }}>
                                    <Badge
                                        color="error"
                                        variant="dot"
                                        overlap="circular"
                                        sx={{ '& .MuiBadge-badge': { border: '2px solid white' } }}
                                    >
                                        <NotificationsIcon sx={{ fontSize: 22 }} />
                                    </Badge>
                                </IconButton>

                                <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 32, alignSelf: 'center', borderColor: '#E2E8F0' }} />

                                {/* User Profile */}
                                {user && (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1.2,
                                            pl: 0.5
                                        }}
                                    >
                                        <Avatar
                                            src={user.profileImageUrl || undefined}
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                background: 'linear-gradient(135deg, #2EC2C9 0%, #35C8C8 100%)',
                                                fontSize: '0.85rem',
                                                fontWeight: 800,
                                                color: 'white',
                                                boxShadow: '0 2px 8px rgba(46, 194, 201, 0.2)'
                                            }}
                                        >
                                            {user.profileImageUrl ? null : (user.role === Role.DOCTOR ? 'DR' : user.firstName[0])}
                                        </Avatar>
                                        {!isMobile && (
                                            <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                                                <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1.1, color: '#1A2B3C', fontSize: '0.9rem' }}>
                                                    {user.role === Role.DOCTOR ? `Dr. ${user.firstName} ${user.lastName}` : `${user.firstName} ${user.lastName}`}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
                                                    {roleLabels[user.role] || user.role}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                )}
                            </Box>
                        </Toolbar>
                    </AppBar>
                </Box>

                {/* Page Content */}
                <Box sx={{ flex: 1, py: 2, pr: 2, pl: 0, overflowY: 'auto' }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}
