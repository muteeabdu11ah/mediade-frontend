'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    Alert,
    CircularProgress,
    InputAdornment,
    IconButton,
    Divider,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import '@/app/globals.css';

import { GRADIENTS, COLORS, BORDER_RADIUS, SHADOWS } from '@/lib/constants/design-tokens';

export default function LoginPage() {
    const { login, isAuthenticated, getDashboardRoute } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.replace(getDashboardRoute());
        }
    }, [isAuthenticated, getDashboardRoute, router]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login({ email, password });
        } catch (err: unknown) {
            const errorMessage =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Invalid credentials. Please try again.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${COLORS.background.subtle} 0%, #FFFFFF 100%)`,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Decorative elements */}
            <Box sx={{
                position: 'absolute', top: -100, left: -100, width: 400, height: 400,
                borderRadius: '50%', background: `radial-gradient(circle, ${COLORS.primary.light}22 0%, transparent 70%)`,
            }} />
            <Box sx={{
                position: 'absolute', bottom: -150, right: -150, width: 500, height: 500,
                borderRadius: '50%', background: `radial-gradient(circle, ${COLORS.primary.main}1A 0%, transparent 70%)`,
            }} />

            <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                <Card
                    sx={{
                        borderRadius: BORDER_RADIUS.lg,
                        boxShadow: SHADOWS.large,
                        backdropFilter: 'blur(20px)',
                        bgcolor: 'rgba(255,255,255,0.92)',
                        border: `1px solid ${COLORS.border.light}`,
                        overflow: 'visible',
                    }}
                >
                    <CardContent sx={{ p: { xs: 4, sm: 6 } }}>
                        {/* Logo */}
                        <Box sx={{ textAlign: 'center', mb: 4 }}>

                            <Image
                                src="/logo.svg"
                                alt="Logo"
                                width={170}
                                height={60}
                            />
                            {/* <Typography variant="h4" fontWeight={900} sx={{ mb: 1, letterSpacing: '-1px' }}>
                                Welcome Back
                            </Typography>
                            <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                Sign in to access your healthcare dashboard
                            </Typography> */}
                        </Box>

                        {/* Error Alert */}
                        {error && (
                            <Alert
                                severity="error"
                                onClose={() => setError('')}
                                sx={{ mb: 3, borderRadius: BORDER_RADIUS.md }}
                            >
                                {error}
                            </Alert>
                        )}

                        {/* Login Form */}
                        <Box component="form" onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                sx={{ mb: 2.5 }}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon sx={{ color: COLORS.primary.main, fontSize: 20 }} />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                sx={{ mb: 4 }}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon sx={{ color: COLORS.primary.main, fontSize: 20 }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                    size="small"
                                                >
                                                    {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                size="large"
                                disabled={isLoading}
                                endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <ArrowForwardIcon />}
                                sx={{
                                    py: 2,
                                    borderRadius: BORDER_RADIUS.md,
                                    boxShadow: SHADOWS.medium,
                                    '&.Mui-disabled': {
                                        background: COLORS.border.strong,
                                        color: 'white',
                                    },
                                }}
                            >
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </Button>
                        </Box>

                        <Divider sx={{ my: 4 }}>
                            <Typography variant="caption" sx={{ color: COLORS.text.muted, px: 2 }}>
                                NEW TO Medaide?
                            </Typography>
                        </Divider>

                        <Button
                            component={Link}
                            href="/register"
                            variant="outlined"
                            fullWidth
                            sx={{
                                py: 1.5,
                                borderRadius: BORDER_RADIUS.md,
                                borderWidth: 2,
                                '&:hover': {
                                    borderWidth: 2,
                                    bgcolor: 'rgba(13, 148, 136, 0.04)',
                                },
                            }}
                        >
                            Create Patient Account
                        </Button>

                        {/* Back to home */}
                        <Box sx={{ textAlign: 'center', mt: 4 }}>
                            <Typography
                                component={Link}
                                href="/"
                                variant="body2"
                                sx={{
                                    color: COLORS.text.secondary,
                                    textDecoration: 'none',
                                    transition: 'color 0.2s',
                                    '&:hover': { color: COLORS.primary.main },
                                }}
                            >
                                ← Back to Home
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}

