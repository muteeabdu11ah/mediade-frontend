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
import { GRADIENTS } from '@/lib/constants/design-tokens';

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
            <AppBar position="fixed" elevation={0}>
                <Container maxWidth="lg">
                    <Toolbar disableGutters sx={{ py: 0.5 }}>
                        {/* Logo */}
                        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <LocalHospitalIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 800,
                                    background: GRADIENTS.primary,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    letterSpacing: '-0.5px',
                                }}
                            >
                                Aeyron Medical
                            </Typography>
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
                                            color: GRADIENTS.primary,
                                            fontWeight: 500,
                                            '&:hover': {
                                                color: 'primary.main',
                                                backgroundColor: 'rgba(0,188,212,0.04)',
                                            },
                                        }}
                                    >
                                        {link.label}
                                    </Button>
                                ))}

                                {isAuthenticated && user ? (
                                    <>
                                        <Button
                                            component={Link}
                                            href={getDashboardRoute()}
                                            variant="outlined"
                                            color="primary"
                                            startIcon={<DashboardIcon />}
                                            sx={{ ml: 1 }}
                                        >
                                            Dashboard
                                        </Button>
                                        <IconButton onClick={handleMenuOpen} sx={{ ml: 1 }}>
                                            <Avatar
                                                sx={{
                                                    width: 36,
                                                    height: 36,
                                                    bgcolor: 'primary.main',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 700,
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
                                                        mt: 1,
                                                        minWidth: 200,
                                                        borderRadius: 2,
                                                        boxShadow: '0 8px 32px rgba(0,188,212,0.16)',
                                                    },
                                                },
                                            }}
                                        >
                                            <Box sx={{ px: 2, py: 1.5 }}>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {user.firstName} {user.lastName}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {user.email}
                                                </Typography>
                                            </Box>
                                            <Divider />
                                            <MenuItem onClick={handleMenuClose} component={Link} href={getDashboardRoute()}>
                                                <DashboardIcon fontSize="small" sx={{ mr: 1.5, color: 'primary.main' }} />
                                                Dashboard
                                            </MenuItem>
                                            <Divider />
                                            <MenuItem onClick={handleLogout}>
                                                <LogoutIcon fontSize="small" sx={{ mr: 1.5, color: 'error.main' }} />
                                                Logout
                                            </MenuItem>
                                        </Menu>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            component={Link}
                                            href="/login"
                                            variant="outlined"
                                            color="primary"
                                            sx={{ ml: 1 }}
                                        >
                                            Sign In
                                        </Button>
                                        <Button
                                            component={Link}
                                            href="/register"
                                            variant="contained"
                                            color="primary"
                                            sx={{ ml: 1 }}
                                        >
                                            Get Started
                                        </Button>
                                    </>
                                )}
                            </Box>
                        )}

                        {/* Mobile Menu Button */}
                        {isMobile && (
                            <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: 'text.primary' }}>
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
                        width: 280,
                        background: 'linear-gradient(180deg, #F0FDFD 0%, #FFFFFF 100%)',
                    },
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <LocalHospitalIcon sx={{ color: 'primary.main' }} />
                        <Typography variant="h6" fontWeight={800} color="primary.main">
                            Aeyron Medical
                        </Typography>
                    </Box>

                    <List>
                        {navLinks.map((link) => (
                            <ListItem key={link.label} disablePadding>
                                <ListItemButton
                                    component={Link}
                                    href={link.href}
                                    onClick={() => setDrawerOpen(false)}
                                    sx={{ borderRadius: 2, mb: 0.5 }}
                                >
                                    <ListItemText primary={link.label} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>

                    <Divider sx={{ my: 2 }} />

                    {isAuthenticated && user ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ px: 2, py: 1 }}>
                                <Typography variant="body2" fontWeight={600}>
                                    {user.firstName} {user.lastName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {user.role.replace('_', ' ')}
                                </Typography>
                            </Box>
                            <Button
                                component={Link}
                                href={getDashboardRoute()}
                                variant="outlined"
                                fullWidth
                                startIcon={<DashboardIcon />}
                                onClick={() => setDrawerOpen(false)}
                            >
                                Dashboard
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                fullWidth
                                startIcon={<LogoutIcon />}
                                onClick={() => {
                                    setDrawerOpen(false);
                                    logout();
                                }}
                            >
                                Logout
                            </Button>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Button
                                component={Link}
                                href="/login"
                                variant="outlined"
                                fullWidth
                                onClick={() => setDrawerOpen(false)}
                            >
                                Sign In
                            </Button>
                            <Button
                                component={Link}
                                href="/register"
                                variant="contained"
                                fullWidth
                                onClick={() => setDrawerOpen(false)}
                            >
                                Get Started
                            </Button>
                        </Box>
                    )}
                </Box>
            </Drawer>

            {/* Spacer to push content below appbar */}
            <Toolbar />
        </>
    );
}
