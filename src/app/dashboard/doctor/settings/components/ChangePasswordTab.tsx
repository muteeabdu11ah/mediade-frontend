'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Divider,
    CircularProgress,
    Alert,
} from '@mui/material';
import api from '@/lib/api';

export default function ChangePasswordTab() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.newPassword !== formData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await api.patch('/auth/change-password', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });
            setSuccess('Password changed successfully!');
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 1, color: '#2D3748' }}>
                Change Password
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Update your account security
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#4A5568' }}>
                    Current Password
                </Typography>
                <TextField
                    fullWidth
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Enter current password"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#F7FAFC' } }}
                />
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#4A5568' }}>
                    New Password
                </Typography>
                <TextField
                    fullWidth
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#F7FAFC' } }}
                />
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#4A5568' }}>
                    Confirm New Password
                </Typography>
                <TextField
                    fullWidth
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#F7FAFC' } }}
                />
            </Box>

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
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Password'}
                </Button>
            </Box>
        </Box>
    );
}
