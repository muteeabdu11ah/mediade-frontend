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
import { useAuth } from '@/lib/auth-context';
import '@/app/globals.css';

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
                background: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 30%, #80DEEA 60%, #4DD0E1 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Decorative elements */}
            <Box sx={{
                position: 'absolute', top: -100, left: -100, width: 400, height: 400,
                borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
            }} />
            <Box sx={{
                position: 'absolute', bottom: -150, right: -150, width: 500, height: 500,
                borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,150,136,0.1) 0%, transparent 70%)',
            }} />
            <Box sx={{
                position: 'absolute', top: '20%', right: '15%', width: 200, height: 200,
                borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            }} />

            <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                <Card
                    sx={{
                        borderRadius: 4,
                        boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                        backdropFilter: 'blur(20px)',
                        bgcolor: 'rgba(255,255,255,0.95)',
                        border: '1px solid rgba(255,255,255,0.5)',
                        overflow: 'visible',
                    }}
                >
                    <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
                        {/* Logo */}
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Box
                                sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    mb: 3,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 3,
                                        background: 'linear-gradient(135deg, #00BCD4 0%, #009688 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <LocalHospitalIcon sx={{ color: 'white', fontSize: 28 }} />
                                </Box>
                            </Box>
                            <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
                                Welcome Back
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Sign in to access your healthcare dashboard
                            </Typography>
                        </Box>

                        {/* Error Alert */}
                        {error && (
                            <Alert
                                severity="error"
                                onClose={() => setError('')}
                                sx={{ mb: 3, borderRadius: 2 }}
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
                                                <EmailIcon sx={{ color: 'primary.light', fontSize: 20 }} />
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
                                sx={{ mb: 3 }}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon sx={{ color: 'primary.light', fontSize: 20 }} />
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
                                    py: 1.5,
                                    fontSize: '1rem',
                                    background: 'linear-gradient(135deg, #00BCD4 0%, #009688 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #00ACC1 0%, #00897B 100%)',
                                    },
                                    '&.Mui-disabled': {
                                        background: 'rgba(0,188,212,0.3)',
                                        color: 'white',
                                    },
                                }}
                            >
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </Button>
                        </Box>

                        <Divider sx={{ my: 3, color: 'text.secondary', fontSize: '0.8rem' }}>
                            New to Aeyron Medical?
                        </Divider>

                        <Button
                            component={Link}
                            href="/register"
                            variant="outlined"
                            fullWidth
                            sx={{
                                py: 1.2,
                                borderColor: 'primary.light',
                                color: 'primary.dark',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    bgcolor: 'rgba(0,188,212,0.04)',
                                },
                            }}
                        >
                            Create Patient Account
                        </Button>

                        {/* Back to home */}
                        <Box sx={{ textAlign: 'center', mt: 3 }}>
                            <Typography
                                component={Link}
                                href="/"
                                variant="body2"
                                sx={{
                                    color: 'text.secondary',
                                    textDecoration: 'none',
                                    '&:hover': { color: 'primary.main' },
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
