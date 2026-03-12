'use client';

import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Container,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { GRADIENTS, COLORS, BORDER_RADIUS, SHADOWS, TYPOGRAPHY } from '@/lib/constants/design-tokens';
import Image from 'next/image';

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/#features' },
    { label: 'About', href: '/#about' },
    { label: 'Contact', href: '/#contact' },
];

export default function Navbar() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { user, isAuthenticated, logout, getDashboardRoute } = useAuth();

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        logout();
    };

    return (
        <>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: `1px solid ${COLORS.border.light}`,
                    zIndex: (theme) => theme.zIndex.drawer + 1
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar disableGutters sx={{ py: 1.5 }}>
                        {/* Logo */}
                        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
                            <Image src="/logo.svg" alt="Logo" width={150} height={50} />
                        </Link>

                        <Box sx={{ flexGrow: 1 }} />

                        {/* Desktop Nav */}
                        {!isMobile && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {navLinks.map((link) => (
                                    <Button
                                        key={link.label}
                                        component={Link}
                                        href={link.href}
                                        sx={{
                                            color: COLORS.text.secondary,
                                            fontWeight: 700,
                                            px: 2.5,
                                            fontSize: '0.95rem',
                                            borderRadius: BORDER_RADIUS.md,
                                            '&:hover': {
                                                color: COLORS.primary.main,
                                                backgroundColor: COLORS.primary.subtle,
                                                transform: 'translateY(-1px)'
                                            },
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {link.label}
                                    </Button>
                                ))}

                                {isAuthenticated && user ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, gap: 2 }}>
                                        <Button
                                            component={Link}
                                            href={getDashboardRoute()}
                                            variant="contained"
                                            startIcon={<DashboardIcon />}
                                            sx={{
                                                borderRadius: BORDER_RADIUS.full,
                                                background: GRADIENTS.primary,
                                                boxShadow: SHADOWS.medium,
                                                fontWeight: 800,
                                                px: 3,
                                                '&:hover': {
                                                    boxShadow: SHADOWS.hover,
                                                    background: GRADIENTS.hover
                                                }
                                            }}
                                        >
                                            Dashboard
                                        </Button>
                                        <IconButton
                                            onClick={handleMenuOpen}
                                            sx={{
                                                p: 0.5,
                                                border: `2px solid ${COLORS.border.medium}`,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    borderColor: COLORS.primary.main,
                                                    transform: 'scale(1.05)'
                                                }
                                            }}
                                        >
                                            <Avatar
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    background: GRADIENTS.secondary,
                                                    fontSize: '0.9rem',
                                                    fontWeight: 800,
                                                    boxShadow: SHADOWS.small
                                                }}
                                            >
                                                {user.firstName[0]}{user.lastName[0]}
                                            </Avatar>
                                        </IconButton>
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl)}
                                            onClose={handleMenuClose}
                                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                            slotProps={{
                                                paper: {
                                                    sx: {
                                                        mt: 2,
                                                        minWidth: 240,
                                                        borderRadius: BORDER_RADIUS.lg,
                                                        boxShadow: SHADOWS.premium,
                                                        border: `1px solid ${COLORS.border.light}`,
                                                        p: 1,
                                                        overflow: 'hidden'
                                                    },
                                                },
                                            }}
                                        >
                                            <Box sx={{ px: 2, py: 2, mb: 1, bgcolor: COLORS.background.subtle, borderRadius: BORDER_RADIUS.md }}>
                                                <Typography variant="body2" fontWeight={800} sx={{ color: COLORS.text.primary, mb: 0.5 }}>
                                                    {user.firstName} {user.lastName}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: COLORS.text.muted, fontWeight: 600 }}>
                                                    {user.email}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ p: 0.5 }}>
                                                <MenuItem onClick={handleMenuClose} component={Link} href={getDashboardRoute()} sx={{ borderRadius: BORDER_RADIUS.md, py: 1.5, mb: 0.5, fontWeight: 700 }}>
                                                    <DashboardIcon fontSize="small" sx={{ mr: 1.5, color: COLORS.primary.main }} />
                                                    My Dashboard
                                                </MenuItem>
                                                <Divider sx={{ my: 1, opacity: 0.5 }} />
                                                <MenuItem onClick={handleLogout} sx={{ borderRadius: BORDER_RADIUS.md, py: 1.5, color: COLORS.error.main, fontWeight: 700, '&:hover': { bgcolor: COLORS.error.subtle } }}>
                                                    <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
                                                    Logout
                                                </MenuItem>
                                            </Box>
                                        </Menu>
                                    </Box>

                                ) : (
                                    <Box sx={{ display: 'flex', gap: 2, ml: 2 }}>
                                        <Button
                                            component={Link}
                                            href="/login"
                                            sx={{
                                                color: COLORS.primary.main,
                                                fontWeight: 800,
                                                '&:hover': { bgcolor: COLORS.primary.subtle }
                                            }}
                                        >
                                            Sign In
                                        </Button>
                                        <Button
                                            component={Link}
                                            href="/register"
                                            variant="contained"
                                            sx={{
                                                borderRadius: BORDER_RADIUS.full,
                                                background: GRADIENTS.primary,
                                                fontWeight: 800,
                                                px: 4,
                                                boxShadow: SHADOWS.medium,
                                                '&:hover': {
                                                    boxShadow: SHADOWS.hover,
                                                    background: GRADIENTS.hover
                                                }
                                            }}
                                        >
                                            Get Started
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        )}

                        {/* Mobile Menu Button */}
                        {isMobile && (
                            <IconButton
                                onClick={() => setDrawerOpen(true)}
                                sx={{
                                    color: COLORS.text.primary,
                                    bgcolor: COLORS.background.subtle,
                                    borderRadius: BORDER_RADIUS.md
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{
                    sx: {
                        width: 300,
                        background: COLORS.background.paper,
                        borderLeft: `1px solid ${COLORS.border.light}`
                    },
                }}
            >
                <Box sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                        <Box sx={{ background: GRADIENTS.primary, p: 0.8, borderRadius: BORDER_RADIUS.sm }}>
                            <LocalHospitalIcon sx={{ color: 'white' }} />
                        </Box>
                        <Typography variant="h3" fontWeight={900} sx={{ background: GRADIENTS.primary, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Aeyron
                        </Typography>
                    </Box>

                    <List sx={{ mb: 4 }}>
                        {navLinks.map((link) => (
                            <ListItem key={link.label} disablePadding>
                                <ListItemButton
                                    component={Link}
                                    href={link.href}
                                    onClick={() => setDrawerOpen(false)}
                                    sx={{
                                        borderRadius: BORDER_RADIUS.md,
                                        mb: 1,
                                        py: 1.5,
                                        '&:hover': {
                                            bgcolor: COLORS.primary.subtle,
                                            color: COLORS.primary.main
                                        }
                                    }}
                                >
                                    <ListItemText
                                        primary={link.label}
                                        primaryTypographyProps={{ fontWeight: 700, fontSize: '1rem' }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>

                    <Divider sx={{ mb: 4, opacity: 0.5 }} />

                    {isAuthenticated && user ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ px: 2, py: 2, bgcolor: COLORS.background.subtle, borderRadius: BORDER_RADIUS.md, mb: 2 }}>
                                <Typography variant="body1" fontWeight={800} color={COLORS.text.primary}>
                                    {user.firstName} {user.lastName}
                                </Typography>
                                <Typography variant="caption" fontWeight={600} color={COLORS.text.muted}>
                                    {user.role.replace('_', ' ')}
                                </Typography>
                            </Box>
                            <Button
                                component={Link}
                                href={getDashboardRoute()}
                                variant="contained"
                                fullWidth
                                startIcon={<DashboardIcon />}
                                onClick={() => setDrawerOpen(false)}
                                sx={{
                                    borderRadius: BORDER_RADIUS.md,
                                    py: 1.5,
                                    background: GRADIENTS.primary,
                                    fontWeight: 800
                                }}
                            >
                                Dashboard
                            </Button>
                            <Button
                                variant="text"
                                fullWidth
                                startIcon={<LogoutIcon />}
                                onClick={() => {
                                    setDrawerOpen(false);
                                    logout();
                                }}
                                sx={{
                                    color: COLORS.error.main,
                                    fontWeight: 700,
                                    py: 1.5,
                                    '&:hover': { bgcolor: COLORS.error.subtle }
                                }}
                            >
                                Logout
                            </Button>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Button
                                component={Link}
                                href="/login"
                                variant="outlined"
                                fullWidth
                                onClick={() => setDrawerOpen(false)}
                                sx={{ borderRadius: BORDER_RADIUS.md, py: 1.5, fontWeight: 700, borderWidth: 2 }}
                            >
                                Sign In
                            </Button>
                            <Button
                                component={Link}
                                href="/register"
                                variant="contained"
                                fullWidth
                                onClick={() => setDrawerOpen(false)}
                                sx={{
                                    borderRadius: BORDER_RADIUS.md,
                                    py: 1.5,
                                    background: GRADIENTS.primary,
                                    fontWeight: 800,
                                    boxShadow: SHADOWS.medium
                                }}
                            >
                                Get Started
                            </Button>
                        </Box>
                    )}
                </Box>
            </Drawer>

            <Toolbar />
        </>
    );
}
