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
import { useChangePassword } from '@/hooks/use-auth-mutations';
import { useAuth } from '@/lib/auth-context';
import { COLORS, GRADIENTS } from '@/lib/constants/design-tokens';
import { isValidPassword, PASSWORD_REQUIREMENTS_TEXT } from '@/lib/utils/validation';

export default function ChangePasswordTab() {
    const { logout } = useAuth();
    const changePassword = useChangePassword();

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

        const passwordValidation = isValidPassword(formData.newPassword);
        if (!passwordValidation.isValid) {
            setError(passwordValidation.error || 'Invalid password.');
            return;
        }

        try {
            await changePassword.mutateAsync({
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
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500 }}>
            <Typography variant="h5" sx={{ mb: 1, color: COLORS.text.primary }}>
                Change Password
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Update your account security
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: COLORS.text.secondary }}>
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
                <Typography variant="subtitle2" sx={{ mb: 1, color: COLORS.text.secondary }}>
                    New Password
                </Typography>
                <TextField
                    fullWidth
                    name="newPassword"
                    type={showNew ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    helperText={PASSWORD_REQUIREMENTS_TEXT}
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
                <Typography variant="subtitle2" sx={{ mb: 1, color: COLORS.text.secondary }}>
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
                    sx={{ px: 4, py: 1, borderRadius: 3, textTransform: 'none', width: { xs: '100%', sm: 'auto' } }}
                    onClick={() => setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={changePassword.isPending}
                    sx={{
                        px: 4,
                        py: 1,
                        borderRadius: 3,
                        textTransform: 'none',
                        width: { xs: '100%', sm: 'auto' },
                        background: GRADIENTS.primary,
                    }}
                >
                    {changePassword.isPending ? <CircularProgress size={24} color="inherit" /> : 'Update Password'}
                </Button>
            </Box>
        </Box>
    );
}
