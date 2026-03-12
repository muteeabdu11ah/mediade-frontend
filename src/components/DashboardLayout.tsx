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
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { GRADIENTS, COLORS, BORDER_RADIUS, SHADOWS, TYPOGRAPHY } from '@/lib/constants/design-tokens';

const DRAWER_WIDTH = 320;

interface DashboardLayoutProps {
    children: React.ReactNode;
    title: string;
}

const roleColors: Record<string, string> = {
    [Role.SUPER_ADMIN]: COLORS.error.main,
    [Role.CLINIC_ADMIN]: COLORS.secondary.main,
    [Role.DOCTOR]: COLORS.primary.main,
    [Role.RECEPTIONIST]: COLORS.warning.main,
    [Role.PATIENT]: COLORS.success.main,
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
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: COLORS.background.paper }}
        >
            {/* Brand */}
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', mb: 1 }}>
                <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Image
                        src="/logo.svg"
                        alt="Logo"
                        width={170}
                        height={60}
                    />
                </Link>
            </Box>

            {/* Navigation */}
            <List sx={{ px: 2, flex: 1, mt: 2 }}>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <ListItem key={item.href} disablePadding sx={{ mb: 1.5 }}>
                            <ListItemButton
                                component={Link}
                                href={item.href}
                                onClick={() => isMobile && setMobileOpen(false)}
                                sx={{

                                    borderRadius: BORDER_RADIUS.md,
                                    px: 2.5,
                                    py: 1.8,
                                    background: isActive ? GRADIENTS.primary : 'transparent',
                                    color: isActive ? 'white' : COLORS.text.secondary,
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: isActive ? SHADOWS.medium : 'none',
                                    '&:hover': {
                                        background: isActive ? GRADIENTS.hover : COLORS.primary.subtle,
                                        color: isActive ? 'white' : COLORS.primary.main,
                                        transform: isActive ? 'none' : 'translateX(6px)',
                                        '& .MuiListItemIcon-root': {
                                            color: isActive ? 'white' : COLORS.primary.main,
                                            transform: 'scale(1.1)'
                                        }
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 44,
                                        color: 'inherit',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {React.isValidElement(item.icon) && React.cloneElement(item.icon as React.ReactElement<any>, {
                                        sx: { fontSize: 24 }
                                    })}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? 800 : 600,
                                        fontSize: '0.875rem',
                                        letterSpacing: isActive ? '0.2px' : '0',
                                        color: isActive ? 'white' : 'inherit'
                                    }}
                                />
                                {isActive && (
                                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'white', opacity: 0.8 }} />
                                )}
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            {/* Logout Section */}
            <Box sx={{ p: 3, borderTop: `1px solid ${COLORS.border.light}`, bgcolor: COLORS.background.default + '40' }}>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={logout}
                        sx={{
                            borderRadius: BORDER_RADIUS.md,
                            px: 2.5,
                            py: 1.5,
                            color: COLORS.text.muted,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                bgcolor: COLORS.error.subtle,
                                color: COLORS.error.main,
                                '& .MuiListItemIcon-root': {
                                    color: COLORS.error.main,
                                    transform: 'rotate(-10deg)'
                                }
                            },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 44, color: 'inherit', transition: 'all 0.3s ease' }}>
                            <LogoutIcon sx={{ fontSize: 22 }} />
                        </ListItemIcon>
                        <ListItemText
                            primary="Logout"
                            primaryTypographyProps={{
                                fontSize: '0.875rem',
                                fontWeight: 800,
                                letterSpacing: '0.5px'
                            }}
                        />
                    </ListItemButton>
                </ListItem>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: COLORS.background.default }}>
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
                                bgcolor: COLORS.background.paper,
                                borderRight: 'none',
                                boxShadow: SHADOWS.large,
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
                        <Box sx={{ p: 3, height: '100%' }}>
                            <Box sx={{
                                height: '100%',
                                bgcolor: COLORS.background.paper,
                                borderRadius: BORDER_RADIUS.lg,
                                boxShadow: SHADOWS.premium,
                                overflow: 'hidden',
                                position: 'relative',
                                border: '2px solid transparent',
                                background: `linear-gradient(${COLORS.background.paper}, ${COLORS.background.paper}) padding-box, ${GRADIENTS.primary} border-box`,
                            }}>
                                {drawerContent}
                            </Box>
                        </Box>
                    </Drawer>
                )}
            </Box>

            {/* Main Content */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflow: 'hidden' }}>
                <Box sx={{ mt: 3, mr: 3, ml: isMobile ? 3 : 0, mb: 0 }}>
                    <AppBar
                        position="static"
                        elevation={0}
                        sx={{
                            bgcolor: COLORS.background.paper,
                            borderRadius: BORDER_RADIUS.md,
                            border: `1px solid ${COLORS.border.light}`,
                            color: COLORS.text.primary,
                            boxShadow: SHADOWS.small,
                        }}
                    >
                        <Toolbar sx={{ py: 1.5, px: 3 }}>
                            {isMobile && (
                                <IconButton
                                    onClick={() => setMobileOpen(true)}
                                    sx={{
                                        mr: 2,
                                        border: `1px solid ${COLORS.border.medium}`,
                                        borderRadius: BORDER_RADIUS.sm,
                                        color: COLORS.primary.main
                                    }}
                                >
                                    <MenuIcon />
                                </IconButton>
                            )}
                            <Typography variant="h5" sx={{ flex: 1, color: COLORS.text.primary, fontWeight: 900, letterSpacing: '-1px' }}>
                                {title}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                                {/* Search Placeholder */}
                                {!isMobile && (
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        bgcolor: COLORS.background.subtle,
                                        borderRadius: BORDER_RADIUS.full,
                                        px: 2,
                                        py: 1,
                                        width: 240,
                                        border: `1px solid ${COLORS.border.light}`,
                                        transition: 'all 0.3s ease',
                                        '&:focus-within': {
                                            borderColor: COLORS.primary.main,
                                            width: 300,
                                            boxShadow: `0 0 0 4px ${COLORS.primary.main}15`
                                        }
                                    }}>
                                        <SearchIcon sx={{ color: COLORS.text.muted, fontSize: 20, mr: 1 }} />
                                        <InputBase placeholder="Search anything..." sx={{ fontSize: '0.875rem', fontWeight: 500, width: '100%' }} />
                                    </Box>
                                )}

                                {/* Notifications */}
                                <IconButton sx={{
                                    color: COLORS.text.secondary,
                                    bgcolor: COLORS.background.subtle,
                                    borderRadius: BORDER_RADIUS.sm,
                                    p: 1.2,
                                    border: `1px solid ${COLORS.border.light}`,
                                    '&:hover': {
                                        color: COLORS.primary.main,
                                        borderColor: COLORS.primary.main,
                                        bgcolor: COLORS.primary.subtle
                                    }
                                }}>
                                    <Badge
                                        color="error"
                                        variant="dot"
                                        overlap="circular"
                                        sx={{ '& .MuiBadge-badge': { border: `2px solid ${COLORS.background.paper}`, width: 10, height: 10, borderRadius: '50%' } }}
                                    >
                                        <NotificationsIcon sx={{ fontSize: 22 }} />
                                    </Badge>
                                </IconButton>

                                <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 24, alignSelf: 'center', borderColor: COLORS.border.medium }} />

                                {/* User Profile */}
                                {user && (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1.5,
                                            cursor: 'pointer',
                                            p: 0.5,
                                            borderRadius: BORDER_RADIUS.md,
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                bgcolor: COLORS.background.subtle
                                            }
                                        }}
                                    >
                                        <Avatar
                                            src={user.profileImageUrl || undefined}
                                            sx={{
                                                width: 44,
                                                height: 44,
                                                background: GRADIENTS.primary,
                                                fontSize: '0.9rem',
                                                fontWeight: 900,
                                                color: 'white',
                                                boxShadow: SHADOWS.medium,
                                                border: `2px solid ${COLORS.background.paper}`
                                            }}
                                        >
                                            {user.profileImageUrl ? null : (user.role === Role.DOCTOR ? 'DR' : user.firstName[0])}
                                        </Avatar>
                                        {!isMobile && (
                                            <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 800, color: COLORS.text.primary, fontSize: '0.9rem' }}>
                                                    {user.role === Role.DOCTOR ? `Dr. ${user.firstName} ${user.lastName}` : `${user.firstName} ${user.lastName}`}
                                                </Typography>
                                                <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 800, color: roleColors[user.role], textTransform: 'uppercase', letterSpacing: '0.5px' }}>
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
                <Box sx={{ flex: 1, p: 3, pt: 2, mr: 1, overflowY: 'auto' }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}
