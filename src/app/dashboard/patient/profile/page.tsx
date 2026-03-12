'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    MenuItem,
    CircularProgress,
    Alert,
    Divider,
    InputAdornment,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Role, Gender, PatientProfile } from '@/lib/types';
import api from '@/lib/api';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function PatientProfilePage() {
    const [profile, setProfile] = useState<PatientProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState<Partial<PatientProfile>>({});

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError('');
            const res = await api.get<PatientProfile>('/patients/profile');
            setProfile(res.data);
            setFormData(res.data);
        } catch (err: unknown) {
            console.error(err);
            setError('Failed to load profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleChange = (field: keyof PatientProfile) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccessMsg('');

        try {
            // Create update payload, ensuring empty strings become null for optional fields
            const payload: Partial<PatientProfile> = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone || null,
                dateOfBirth: formData.dateOfBirth || null,
                gender: formData.gender || null,
                bloodGroup: formData.bloodGroup || null,
                address: formData.address || null,
                emergencyContact: formData.emergencyContact || null,
                medicalHistory: formData.medicalHistory || null,
            };

            const res = await api.patch<PatientProfile>('/patients/profile', payload);
            setProfile(res.data);
            setFormData(res.data);
            setSuccessMsg('Profile updated successfully!');
            setIsEditing(false);
        } catch (err: unknown) {
            const errorMessage =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Failed to update profile.';
            setError(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    return (
        <ProtectedRoute allowedRoles={[Role.PATIENT]}>
            <DashboardLayout title="My Profile">
                <Box sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box>
                            <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
                                Personal Information
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                View and manage your medical profile and contact details.
                            </Typography>
                        </Box>
                        {!isEditing && !loading && (
                            <Button
                                variant="outlined"
                                startIcon={<SettingsIcon />}
                                onClick={() => setIsEditing(true)}
                            >
                                Edit Profile
                            </Button>
                        )}
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                    {successMsg && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMsg('')}>{successMsg}</Alert>}

                    {loading ? (
                        <Card sx={{ p: 5, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 3 }}>
                            <CircularProgress />
                        </Card>
                    ) : (
                        profile && (
                            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                <Box component="form" onSubmit={handleSave}>
                                    <CardContent sx={{ p: { xs: 3, sm: 4 } }}>

                                        <Typography variant="h3" fontWeight={700} sx={{ mb: 3, color: 'primary.dark' }}>
                                            Basic Details
                                        </Typography>

                                        <Grid container spacing={3}>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    fullWidth
                                                    label="First Name"
                                                    disabled={!isEditing}
                                                    required
                                                    value={formData.firstName || ''}
                                                    onChange={handleChange('firstName')}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Last Name"
                                                    disabled={!isEditing}
                                                    required
                                                    value={formData.lastName || ''}
                                                    onChange={handleChange('lastName')}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Email Address"
                                                    disabled // Email usually can't be changed easily safely
                                                    value={formData.email || ''}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Phone Number"
                                                    disabled={!isEditing}
                                                    value={formData.phone || ''}
                                                    onChange={handleChange('phone')}
                                                    slotProps={{
                                                        input: {
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <PhoneIcon fontSize="small" />
                                                                </InputAdornment>
                                                            ),
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>

                                        <Divider sx={{ my: 4 }} />

                                        <Typography variant="h3" fontWeight={700} sx={{ mb: 3, color: 'primary.dark' }}>
                                            Medical Information
                                        </Typography>

                                        <Grid container spacing={3}>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Date of Birth"
                                                    type="date"
                                                    disabled={!isEditing}
                                                    value={formData.dateOfBirth || ''}
                                                    onChange={handleChange('dateOfBirth')}
                                                    slotProps={{ inputLabel: { shrink: true } }}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    fullWidth
                                                    select
                                                    label="Gender"
                                                    disabled={!isEditing}
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
                                                    select
                                                    label="Blood Group"
                                                    disabled={!isEditing}
                                                    value={formData.bloodGroup || ''}
                                                    onChange={handleChange('bloodGroup')}
                                                >
                                                    <MenuItem value="">Select</MenuItem>
                                                    {bloodGroups.map((bg) => (
                                                        <MenuItem key={bg} value={bg}>{bg}</MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                        </Grid>

                                        <Grid container spacing={3} sx={{ mt: 0 }}>
                                            <Grid size={{ xs: 12 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Medical History / Allergies"
                                                    disabled={!isEditing}
                                                    multiline
                                                    rows={3}
                                                    value={formData.medicalHistory || ''}
                                                    onChange={handleChange('medicalHistory')}
                                                    placeholder="List any known allergies, chronic conditions, or past surgeries."
                                                />
                                            </Grid>
                                        </Grid>

                                        <Divider sx={{ my: 4 }} />

                                        <Typography variant="h3" fontWeight={700} sx={{ mb: 3, color: 'primary.dark' }}>
                                            Contact & Emergency
                                        </Typography>

                                        <Grid container spacing={3}>
                                            <Grid size={{ xs: 12 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Home Address"
                                                    disabled={!isEditing}
                                                    multiline
                                                    rows={2}
                                                    value={formData.address || ''}
                                                    onChange={handleChange('address')}
                                                    slotProps={{
                                                        input: {
                                                            startAdornment: (
                                                                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                                                    <HomeIcon fontSize="small" />
                                                                </InputAdornment>
                                                            ),
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Emergency Contact"
                                                    disabled={!isEditing}
                                                    value={formData.emergencyContact || ''}
                                                    onChange={handleChange('emergencyContact')}
                                                    placeholder="Name & Phone Number"
                                                />
                                            </Grid>
                                        </Grid>

                                        {isEditing && (
                                            <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
                                                <Button
                                                    variant="outlined"
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        setFormData(profile); // Reset form
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    disabled={saving}
                                                    sx={{ background: 'linear-gradient(135deg, #00BCD4 0%, #009688 100%)' }}
                                                >
                                                    {saving ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
                                                </Button>
                                            </Box>
                                        )}
                                    </CardContent>
                                </Box>
                            </Card>
                        )
                    )}
                </Box>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
