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
    Stepper,
    Step,
    StepLabel,
    Grid,
    MenuItem,
    Divider,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HomeIcon from '@mui/icons-material/Home';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Gender, type RegisterRequest } from '@/lib/types';
import '@/app/globals.css';

const steps = ['Account Details', 'Personal Information'];

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function RegisterPage() {
    const { register, isAuthenticated, getDashboardRoute } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.replace(getDashboardRoute());
        }
    }, [isAuthenticated, getDashboardRoute, router]);

    const [activeStep, setActiveStep] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState<RegisterRequest>({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        gender: undefined,
        dateOfBirth: '',
        bloodGroup: '',
        address: '',
        emergencyContact: '',
    });

    const handleChange = (field: keyof RegisterRequest) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleNext = () => {
        if (activeStep === 0) {
            if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
                setError('Please fill in all required fields.');
                return;
            }
            if (formData.password.length < 6) {
                setError('Password must be at least 6 characters.');
                return;
            }
            setError('');
        }
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setError('');
        setActiveStep((prev) => prev - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const payload: RegisterRequest = {
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
            };

            if (formData.phone) payload.phone = formData.phone;
            if (formData.gender) payload.gender = formData.gender;
            if (formData.dateOfBirth) payload.dateOfBirth = formData.dateOfBirth;
            if (formData.bloodGroup) payload.bloodGroup = formData.bloodGroup;
            if (formData.address) payload.address = formData.address;
            if (formData.emergencyContact) payload.emergencyContact = formData.emergencyContact;

            await register(payload);
        } catch (err: unknown) {
            const errorMessage =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Registration failed. Please try again.';
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
                py: 4,
                background: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 30%, #80DEEA 60%, #4DD0E1 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Decorative elements */}
            <Box sx={{
                position: 'absolute', top: -100, right: -100, width: 400, height: 400,
                borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
            }} />
            <Box sx={{
                position: 'absolute', bottom: -150, left: -150, width: 500, height: 500,
                borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,150,136,0.1) 0%, transparent 70%)',
            }} />

            <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                <Card
                    sx={{
                        borderRadius: 4,
                        boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                        backdropFilter: 'blur(20px)',
                        bgcolor: 'rgba(255,255,255,0.95)',
                        border: '1px solid rgba(255,255,255,0.5)',
                    }}
                >
                    <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
                        {/* Logo */}
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <Box sx={{ display: 'inline-flex', mb: 2 }}>
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
                            <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
                                Create Account
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Join Aeyron Medical as a patient
                            </Typography>
                        </Box>

                        {/* Stepper */}
                        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel
                                        sx={{
                                            '& .MuiStepLabel-label': {
                                                fontSize: '0.8rem',
                                                fontWeight: 500,
                                            },
                                        }}
                                    >
                                        {label}
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                        {/* Error Alert */}
                        {error && (
                            <Alert severity="error" onClose={() => setError('')} sx={{ mb: 3, borderRadius: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit}>
                            {/* Step 1: Account Details */}
                            {activeStep === 0 && (
                                <Box>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="First Name"
                                                value={formData.firstName}
                                                onChange={handleChange('firstName')}
                                                required
                                                slotProps={{
                                                    input: {
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <PersonIcon sx={{ color: 'primary.light', fontSize: 20 }} />
                                                            </InputAdornment>
                                                        ),
                                                    },
                                                }}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Last Name"
                                                value={formData.lastName}
                                                onChange={handleChange('lastName')}
                                                required
                                                slotProps={{
                                                    input: {
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <PersonIcon sx={{ color: 'primary.light', fontSize: 20 }} />
                                                            </InputAdornment>
                                                        ),
                                                    },
                                                }}
                                            />
                                        </Grid>
                                    </Grid>

                                    <TextField
                                        fullWidth
                                        label="Email Address"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange('email')}
                                        required
                                        sx={{ mt: 2 }}
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
                                        value={formData.password}
                                        onChange={handleChange('password')}
                                        required
                                        helperText="Minimum 6 characters"
                                        sx={{ mt: 2 }}
                                        slotProps={{
                                            input: {
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LockIcon sx={{ color: 'primary.light', fontSize: 20 }} />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                                                            {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Phone Number"
                                        value={formData.phone}
                                        onChange={handleChange('phone')}
                                        placeholder="+1234567890"
                                        sx={{ mt: 2 }}
                                        slotProps={{
                                            input: {
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PhoneIcon sx={{ color: 'primary.light', fontSize: 20 }} />
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                    />

                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={handleNext}
                                        endIcon={<ArrowForwardIcon />}
                                        sx={{
                                            mt: 3,
                                            py: 1.5,
                                            background: 'linear-gradient(135deg, #00BCD4 0%, #009688 100%)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #00ACC1 0%, #00897B 100%)',
                                            },
                                        }}
                                    >
                                        Continue
                                    </Button>
                                </Box>
                            )}

                            {/* Step 2: Personal Information */}
                            {activeStep === 1 && (
                                <Box>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                select
                                                label="Gender"
                                                value={formData.gender || ''}
                                                onChange={handleChange('gender')}
                                            >
                                                <MenuItem value="">Select</MenuItem>
                                                <MenuItem value={Gender.MALE}>Male</MenuItem>
                                                <MenuItem value={Gender.FEMALE}>Female</MenuItem>
                                                <MenuItem value={Gender.OTHER}>Other</MenuItem>
                                            </TextField>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Date of Birth"
                                                type="date"
                                                value={formData.dateOfBirth}
                                                onChange={handleChange('dateOfBirth')}
                                                slotProps={{
                                                    inputLabel: { shrink: true },
                                                    input: {
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <CalendarMonthIcon sx={{ color: 'primary.light', fontSize: 20 }} />
                                                            </InputAdornment>
                                                        ),
                                                    },
                                                }}
                                            />
                                        </Grid>
                                    </Grid>

                                    <TextField
                                        fullWidth
                                        select
                                        label="Blood Group"
                                        value={formData.bloodGroup || ''}
                                        onChange={handleChange('bloodGroup')}
                                        sx={{ mt: 2 }}
                                    >
                                        <MenuItem value="">Select</MenuItem>
                                        {bloodGroups.map((bg) => (
                                            <MenuItem key={bg} value={bg}>{bg}</MenuItem>
                                        ))}
                                    </TextField>

                                    <TextField
                                        fullWidth
                                        label="Address"
                                        value={formData.address}
                                        onChange={handleChange('address')}
                                        multiline
                                        rows={2}
                                        sx={{ mt: 2 }}
                                        slotProps={{
                                            input: {
                                                startAdornment: (
                                                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                                        <HomeIcon sx={{ color: 'primary.light', fontSize: 20 }} />
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Emergency Contact"
                                        value={formData.emergencyContact}
                                        onChange={handleChange('emergencyContact')}
                                        placeholder="+1987654321"
                                        sx={{ mt: 2 }}
                                        slotProps={{
                                            input: {
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PhoneIcon sx={{ color: 'error.light', fontSize: 20 }} />
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                    />

                                    <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                                        <Button
                                            variant="outlined"
                                            onClick={handleBack}
                                            startIcon={<ArrowBackIcon />}
                                            sx={{ flex: 1, py: 1.5 }}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={isLoading}
                                            endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <ArrowForwardIcon />}
                                            sx={{
                                                flex: 2,
                                                py: 1.5,
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
                                            {isLoading ? 'Creating...' : 'Create Account'}
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                        </Box>

                        <Divider sx={{ my: 3, color: 'text.secondary', fontSize: '0.8rem' }}>
                            Already have an account?
                        </Divider>

                        <Button
                            component={Link}
                            href="/login"
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
                            Sign In Instead
                        </Button>

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
