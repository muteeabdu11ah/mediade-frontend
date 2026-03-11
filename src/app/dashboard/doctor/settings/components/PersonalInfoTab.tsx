'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Grid,
    Button,
    Avatar,
    IconButton,
    Divider,
    CircularProgress,
    Alert,
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';

export default function PersonalInfoTab() {
    const { user, refreshProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        specialty: user?.doctorProfile?.specialty || '',
        yearsOfExperience: user?.doctorProfile?.yearsOfExperience?.toString() || '',
        languages: user?.doctorProfile?.languages || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError('');
        setSuccess('');

        const data = new FormData();
        data.append('file', file);

        try {
            await api.post('/auth/profile-image', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            await refreshProfile();
            setSuccess('Profile image updated successfully!');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const payload: any = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
            };

            if (user?.role === 'doctor') {
                payload.specialty = formData.specialty;
                payload.yearsOfExperience = formData.yearsOfExperience ? Number(formData.yearsOfExperience) : undefined;
                payload.languages = formData.languages;
            }

            await api.patch('/auth/profile', payload);
            await refreshProfile();
            setSuccess('Profile updated successfully!');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <input
                type="file"
                hidden
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/jpeg,image/png,image/webp"
            />
            <Typography variant="h5" fontWeight={700} sx={{ mb: 1, color: '#2D3748' }}>
                Profile Info
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Personalize your profile info
            </Typography>

            <Box sx={{ position: 'relative', width: 100, height: 100, mb: 4 }}>
                <Avatar
                    src={user?.profileImageUrl || undefined}
                    sx={{
                        width: 100,
                        height: 100,
                        border: '4px solid #F0F9FA',
                        bgcolor: 'primary.main',
                        fontSize: '2.5rem',
                        fontWeight: 700,
                    }}
                >
                    {user?.profileImageUrl ? null : (formData.firstName?.[0] || 'D')}
                </Avatar>
                <IconButton
                    onClick={handleImageClick}
                    disabled={uploading}
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        bgcolor: 'white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        '&:hover': { bgcolor: '#f8f9fa' },
                    }}
                    size="small"
                >
                    {uploading ? <CircularProgress size={18} /> : <CameraAltIcon sx={{ fontSize: 18, color: 'text.secondary' }} />}
                </IconButton>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#4A5568' }}>
                        First Name
                    </Typography>
                    <TextField
                        fullWidth
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Enter First Name"
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                bgcolor: '#F7FAFC',
                            }
                        }}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#4A5568' }}>
                        Last Name
                    </Typography>
                    <TextField
                        fullWidth
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Enter Last Name"
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                bgcolor: '#F7FAFC',
                            }
                        }}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 12 }}>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#4A5568' }}>
                        Email
                    </Typography>
                    <TextField
                        fullWidth
                        name="email"
                        value={formData.email}
                        disabled
                        placeholder="Enter Email"
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                bgcolor: '#F7FAFC',
                            }
                        }}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 12 }}>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#4A5568' }}>
                        Phone Number
                    </Typography>
                    <TextField
                        fullWidth
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter Phone Number"
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                bgcolor: '#F7FAFC',
                            }
                        }}
                    />
                </Grid>

                {user?.role === 'doctor' && (
                    <>
                        <Grid size={{ xs: 12, md: 12 }}>
                            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#4A5568' }}>
                                Specialty
                            </Typography>
                            <TextField
                                fullWidth
                                name="specialty"
                                value={formData.specialty}
                                onChange={handleChange}
                                placeholder="e.g. Cardiologist"
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        bgcolor: '#F7FAFC',
                                    }
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#4A5568' }}>
                                Years of Experience
                            </Typography>
                            <TextField
                                fullWidth
                                type="number"
                                name="yearsOfExperience"
                                value={formData.yearsOfExperience}
                                onChange={handleChange}
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        bgcolor: '#F7FAFC',
                                    }
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#4A5568' }}>
                                Languages Spoken
                            </Typography>
                            <TextField
                                fullWidth
                                name="languages"
                                value={formData.languages}
                                onChange={handleChange}
                                placeholder="e.g. English, Spanish"
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        bgcolor: '#F7FAFC',
                                    }
                                }}
                            />
                        </Grid>
                    </>
                )}
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                    variant="outlined"
                    sx={{ px: 4, py: 1, borderRadius: 3, textTransform: 'none', fontWeight: 600 }}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                        px: 4,
                        py: 1,
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #00BCD4 0%, #009688 100%)',
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Save'}
                </Button>
            </Box>
        </Box>
    );
}
