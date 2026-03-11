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
    IconButton,
    InputAdornment,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export default function ChangePasswordTab() {
    const { logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

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
            setSuccess('Password changed successfully! Logging out...');
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });

            // Clear session (logout) on success as requested
            setTimeout(() => {
                logout();
            }, 2000);
        } catch (err: any) {
            // Failure case: do not logout, just show error
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
                    type={showCurrent ? 'text' : 'password'}
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Enter current password"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#F7FAFC' } }}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowCurrent(!showCurrent)}
                                        onMouseDown={(e) => e.preventDefault()}
                                        edge="end"
                                    >
                                        {showCurrent ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                />
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#4A5568' }}>
                    New Password
                </Typography>
                <TextField
                    fullWidth
                    name="newPassword"
                    type={showNew ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#F7FAFC' } }}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowNew(!showNew)}
                                        onMouseDown={(e) => e.preventDefault()}
                                        edge="end"
                                    >
                                        {showNew ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                />
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#4A5568' }}>
                    Confirm New Password
                </Typography>
                <TextField
                    fullWidth
                    name="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#F7FAFC' } }}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        onMouseDown={(e) => e.preventDefault()}
                                        edge="end"
                                    >
                                        {showConfirm ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                />
            </Box>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row' }, justifyContent: 'flex-end', gap: 2 }}>
                <Button
                    variant="outlined"
                    sx={{ px: 4, py: 1, borderRadius: 3, textTransform: 'none', fontWeight: 600, width: { xs: '100%', sm: 'auto' } }}
                    onClick={() => setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })}
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
                        width: { xs: '100%', sm: 'auto' },
                        background: 'linear-gradient(135deg, #00BCD4 0%, #009688 100%)',
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Password'}
                </Button>
            </Box>
        </Box>
    );
}
