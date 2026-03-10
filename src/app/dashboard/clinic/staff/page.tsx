'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Tooltip,
    CircularProgress,
    Alert,
    Switch,
    FormControlLabel,
    MenuItem,
    Grid,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventIcon from '@mui/icons-material/Event';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Role, User } from '@/lib/types';
import api from '@/lib/api';

interface StaffFormData {
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: Role.DOCTOR | Role.RECEPTIONIST;
    isActive: boolean;
}

const initialFormData: StaffFormData = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: Role.DOCTOR,
    isActive: true,
};

export default function ClinicStaffManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [formData, setFormData] = useState<StaffFormData>(initialFormData);
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await api.get<User[]>('/users');
            // The backend filters this to only users in the admin's clinic.
            setUsers(res.data.filter(u => u.role === Role.DOCTOR || u.role === Role.RECEPTIONIST));
            setError('');
        } catch (err) {
            setError('Failed to load staff list.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenAdd = () => {
        setDialogMode('add');
        setFormData(initialFormData);
        setSelectedUserId(null);
        setOpenDialog(true);
    };

    const handleOpenEdit = (user: User) => {
        setDialogMode('edit');
        setFormData({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone || '',
            role: user.role as Role.DOCTOR | Role.RECEPTIONIST,
            isActive: user.isActive,
            password: '',
        });
        setSelectedUserId(user.id);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleFormChange = (prop: keyof StaffFormData) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = prop === 'isActive' ? event.target.checked : event.target.value;
        setFormData((prev) => ({ ...prev, [prop]: value as any }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            if (dialogMode === 'add') {
                const payload = {
                    email: formData.email,
                    password: formData.password,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone || undefined,
                };
                const endpoint = formData.role === Role.DOCTOR ? '/users/doctor' : '/users/receptionist';
                await api.post(endpoint, payload);
            } else if (dialogMode === 'edit' && selectedUserId) {
                const payload = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone || undefined,
                    isActive: formData.isActive,
                };
                await api.patch(`/users/${selectedUserId}`, payload);
            }
            await fetchData();
            setOpenDialog(false);
        } catch (err: unknown) {
            const errorMessage =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Failed to save staff member.';
            setError(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const handleDeactivate = async (id: string, currentStatus: boolean, userRole: string) => {
        if (!currentStatus) return;
        if (userRole === Role.SUPER_ADMIN || userRole === Role.CLINIC_ADMIN) {
            alert("Cannot deactivate an admin from this view.");
            return;
        }
        if (!window.confirm('Are you sure you want to deactivate this staff member?')) return;

        try {
            await api.delete(`/users/${id}`);
            await fetchData();
        } catch (err) {
            console.error('Failed to deactivate user', err);
            setError('Failed to deactivate staff.');
        }
    };

    const getRoleLabel = (role: Role) => {
        switch (role) {
            case Role.DOCTOR: return 'Doctor';
            case Role.RECEPTIONIST: return 'Receptionist';
            default: return role;
        }
    };

    const getRoleColor = (role: Role) => {
        switch (role) {
            case Role.DOCTOR: return { bg: 'rgba(66,165,245,0.1)', color: '#42A5F5' };
            case Role.RECEPTIONIST: return { bg: 'rgba(255,167,38,0.1)', color: '#FFA726' };
            default: return { bg: 'rgba(0,0,0,0.05)', color: 'text.secondary' };
        }
    };

    return (
        <ProtectedRoute allowedRoles={[Role.CLINIC_ADMIN]}>
            <DashboardLayout title="Staff Management">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box>
                        <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
                            Clinic Staff
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Manage doctors and receptionists in your clinic.
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleOpenAdd}
                        sx={{
                            background: 'linear-gradient(135deg, #00BCD4 0%, #009688 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #00ACC1 0%, #00897B 100%)',
                            },
                        }}
                    >
                        Add Staff
                    </Button>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                <Card sx={{ bgcolor: 'white', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 5 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead sx={{ bgcolor: 'rgba(0,188,212,0.04)' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Name</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Role</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Contact</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textAlign: 'right' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                                                No staff found in this clinic.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        users.map((user) => {
                                            const roleColors = getRoleColor(user.role);
                                            return (
                                                <TableRow key={user.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    <TableCell>
                                                        <Typography variant="body2" fontWeight={600}>
                                                            {user.firstName} {user.lastName}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {user.email}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={getRoleLabel(user.role)}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: roleColors.bg,
                                                                color: roleColors.color,
                                                                fontWeight: 700,
                                                                fontSize: '0.7rem',
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {user.phone || 'N/A'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={user.isActive ? 'Active' : 'Inactive'}
                                                            size="small"
                                                            icon={user.isActive ? <CheckCircleIcon /> : <BlockIcon />}
                                                            sx={{
                                                                bgcolor: user.isActive ? 'rgba(102,187,106,0.1)' : 'rgba(239,83,80,0.1)',
                                                                color: user.isActive ? '#66BB6A' : '#EF5350',
                                                                fontWeight: 600,
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Tooltip title="Edit Staff">
                                                            <IconButton color="primary" onClick={() => handleOpenEdit(user)}>
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        {user.isActive && (
                                                            <Tooltip title="Deactivate Staff">
                                                                <IconButton color="error" onClick={() => handleDeactivate(user.id, user.isActive, user.role)}>
                                                                    <BlockIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Card>

                {/* Add/Edit Dialog */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                    <DialogTitle sx={{ fontWeight: 800 }}>
                        {dialogMode === 'add' ? 'Add Clinic Staff' : 'Edit Staff'}
                    </DialogTitle>
                    <DialogContent dividers>
                        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="First Name"
                                        fullWidth
                                        required
                                        value={formData.firstName}
                                        onChange={handleFormChange('firstName')}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="Last Name"
                                        fullWidth
                                        required
                                        value={formData.lastName}
                                        onChange={handleFormChange('lastName')}
                                    />
                                </Grid>
                            </Grid>

                            <TextField
                                label="Email Address"
                                type="email"
                                fullWidth
                                required
                                disabled={dialogMode === 'edit'}
                                value={formData.email}
                                onChange={handleFormChange('email')}
                                helperText={dialogMode === 'edit' ? "Email cannot be changed." : ""}
                            />

                            {dialogMode === 'add' && (
                                <>
                                    <TextField
                                        label="Password"
                                        type="password"
                                        fullWidth
                                        required
                                        value={formData.password}
                                        onChange={handleFormChange('password')}
                                        helperText="Minimum 6 characters"
                                    />

                                    <TextField
                                        select
                                        label="Staff Role"
                                        fullWidth
                                        required
                                        value={formData.role}
                                        onChange={handleFormChange('role')}
                                    >
                                        <MenuItem value={Role.DOCTOR}>Doctor</MenuItem>
                                        <MenuItem value={Role.RECEPTIONIST}>Receptionist</MenuItem>
                                    </TextField>
                                </>
                            )}

                            <TextField
                                label="Phone Number"
                                fullWidth
                                value={formData.phone}
                                onChange={handleFormChange('phone')}
                            />

                            {dialogMode === 'edit' && (
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.isActive}
                                            onChange={handleFormChange('isActive')}
                                            color="primary"
                                        />
                                    }
                                    label="Active Status"
                                />
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 2, pt: 1 }}>
                        <Button onClick={handleCloseDialog} color="inherit">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            variant="contained"
                            disabled={
                                saving ||
                                !formData.firstName ||
                                !formData.lastName ||
                                (dialogMode === 'add' && (!formData.email || !formData.password || !formData.role))
                            }
                            sx={{
                                background: 'linear-gradient(135deg, #00BCD4 0%, #009688 100%)',
                            }}
                        >
                            {saving ? <CircularProgress size={24} color="inherit" /> : 'Save Staff'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
