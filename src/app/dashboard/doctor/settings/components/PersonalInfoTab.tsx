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
    MenuItem,
    Chip,
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useAuth } from '@/lib/auth-context';
import { useUpdateProfile, useUpdateProfileImage } from '@/hooks/use-auth-mutations';
import { Specialty, Language } from '@/lib/types';
import { COLORS, GRADIENTS } from '@/lib/constants/design-tokens';

export default function PersonalInfoTab() {
    const { user, refreshProfile } = useAuth();
    const updateProfileImage = useUpdateProfileImage();
    const updateProfile = useUpdateProfile();

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
        languages: user?.doctorProfile?.languages || ([] as Language[]),
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

        setError('');
        setSuccess('');

        try {
            await updateProfileImage.mutateAsync(file);
            await refreshProfile();
            setSuccess('Profile image updated successfully!');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to upload image');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const payload: any = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
            };

            if (user?.role === 'doctor') {
                payload.specialty = formData.specialty || undefined;
                payload.yearsOfExperience = formData.yearsOfExperience ? Number(formData.yearsOfExperience) : undefined;
                payload.languages = formData.languages.length > 0 ? formData.languages : undefined;
            }

            await updateProfile.mutateAsync(payload);
            await refreshProfile();
            setSuccess('Profile updated successfully!');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile');
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
            <Typography variant="h5" sx={{ mb: 1, color: COLORS.text.primary }}>
                Profile Info
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Personalize your profile info
            </Typography>

            <Box sx={{ position: 'relative', width: { xs: 80, md: 100 }, height: { xs: 80, md: 100 }, mb: 4 }}>
                <Avatar
                    src={user?.profileImageUrl || undefined}
                    sx={{
                        width: { xs: 80, md: 100 },
                        height: { xs: 80, md: 100 },
                        border: '4px solid #F0F9FA',
                        bgcolor: 'primary.main',
                        fontSize: { xs: '2rem', md: '2.5rem' },
                    }}
                >
                    {user?.profileImageUrl ? null : (formData.firstName?.[0] || 'D')}
                </Avatar>
                <IconButton
                    onClick={handleImageClick}
                    disabled={updateProfileImage.isPending}
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
                    {updateProfileImage.isPending ? <CircularProgress size={18} /> : <CameraAltIcon sx={{ fontSize: 18, color: 'text.secondary' }} />}
                </IconButton>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
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
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: COLORS.text.secondary }}>
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
                <Grid size={{ xs: 12 }}>
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
                <Grid size={{ xs: 12 }}>
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
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#4A5568' }}>
                                Specialty
                            </Typography>
                            <TextField
                                select
                                fullWidth
                                name="specialty"
                                value={formData.specialty}
                                onChange={handleChange}
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        bgcolor: '#F7FAFC',
                                    }
                                }}
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                {Object.values(Specialty).map((val) => (
                                    <MenuItem key={val} value={val}>{val}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
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
                        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#4A5568' }}>
                                Languages Spoken
                            </Typography>
                            <TextField
                                select
                                SelectProps={{
                                    multiple: true,
                                    renderValue: (selected: any) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {(selected as string[]).map((value) => (
                                                <Chip key={value} label={value} size="small" />
                                            ))}
                                        </Box>
                                    ),
                                }}
                                fullWidth
                                name="languages"
                                value={formData.languages}
                                onChange={(e) => setFormData({ ...formData, languages: e.target.value as unknown as Language[] })}
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        bgcolor: '#F7FAFC',
                                    }
                                }}
                            >
                                {Object.values(Language).map((val) => (
                                    <MenuItem key={val} value={val}>{val}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </>
                )}
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row' }, justifyContent: 'flex-end', gap: 2 }}>
                <Button
                    variant="outlined"
                    fullWidth={false}
                    sx={{ px: 4, py: 1, borderRadius: 3, textTransform: 'none', width: { xs: '100%', sm: 'auto' } }}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={updateProfile.isPending}
                    sx={{
                        px: 4,
                        py: 1,
                        borderRadius: 3,
                        textTransform: 'none',
                        width: { xs: '100%', sm: 'auto' },
                        background: GRADIENTS.primary,
                    }}
                >
                    {updateProfile.isPending ? <CircularProgress size={24} color="inherit" /> : 'Save'}
                </Button>
            </Box>
        </Box>
    );
}
