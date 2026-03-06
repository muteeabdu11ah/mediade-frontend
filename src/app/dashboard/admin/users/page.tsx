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
import BusinessIcon from '@mui/icons-material/Business';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Role, User, Clinic } from '@/lib/types';
import api from '@/lib/api';

const navItems = [
    { label: 'Overview', href: '/dashboard/admin', icon: <DashboardIcon /> },
    { label: 'Clinics', href: '/dashboard/admin/clinics', icon: <BusinessIcon /> },
    { label: 'Users', href: '/dashboard/admin/users', icon: <PeopleIcon /> },
    { label: 'Analytics', href: '/dashboard/admin/analytics', icon: <BarChartIcon /> },
    { label: 'Settings', href: '/dashboard/admin/settings', icon: <SettingsIcon /> },
];

interface UserFormData {
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    phone: string;
    clinicId: string;
    isActive: boolean;
}

const initialFormData: UserFormData = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    clinicId: '',
    isActive: true,
};

export default function UsersManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [formData, setFormData] = useState<UserFormData>(initialFormData);
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersRes, clinicsRes] = await Promise.all([
                api.get<User[]>('/users'),
                api.get<Clinic[]>('/clinics'),
            ]);
            setUsers(usersRes.data);
            setClinics(clinicsRes.data);
            setError('');
        } catch (err) {
            setError('Failed to load data.');
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
            clinicId: user.clinicId || '',
            isActive: user.isActive,
            password: '', // Password is not populated on edit
        });
        setSelectedUserId(user.id);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleFormChange = (prop: keyof UserFormData) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = prop === 'isActive' ? event.target.checked : event.target.value;
        setFormData((prev) => ({ ...prev, [prop]: value }));
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
                    clinicId: formData.clinicId || undefined,
                    role: Role.CLINIC_ADMIN, // Super admin creates clinic admins
                };
                await api.post('/users/clinic-admin', payload);
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
                'Failed to save user.';
            setError(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const handleDeactivate = async (id: string, currentStatus: boolean, userRole: string) => {
        if (!currentStatus) return; // Already inactive
        if (userRole === Role.SUPER_ADMIN) {
            alert("Cannot deactivate a super admin.");
            return;
        }
        if (!window.confirm('Are you sure you want to deactivate this user?')) return;

        try {
            await api.delete(`/users/${id}`);
            await fetchData();
        } catch (err) {
            console.error('Failed to deactivate user', err);
            setError('Failed to deactivate user.');
        }
    };

    const getRoleLabel = (role: Role) => {
        switch (role) {
            case Role.SUPER_ADMIN: return 'Super Admin';
            case Role.CLINIC_ADMIN: return 'Clinic Admin';
            case Role.DOCTOR: return 'Doctor';
            case Role.RECEPTIONIST: return 'Receptionist';
            case Role.PATIENT: return 'Patient';
            default: return role;
        }
    };

    const getRoleColor = (role: Role) => {
        switch (role) {
            case Role.SUPER_ADMIN: return { bg: 'rgba(239,83,80,0.1)', color: '#EF5350' };
            case Role.CLINIC_ADMIN: return { bg: 'rgba(171,71,188,0.1)', color: '#AB47BC' };
            case Role.DOCTOR: return { bg: 'rgba(66,165,245,0.1)', color: '#42A5F5' };
            case Role.RECEPTIONIST: return { bg: 'rgba(255,167,38,0.1)', color: '#FFA726' };
            case Role.PATIENT: return { bg: 'rgba(102,187,106,0.1)', color: '#66BB6A' };
            default: return { bg: 'rgba(0,0,0,0.05)', color: 'text.secondary' };
        }
    };

    return (
        <ProtectedRoute allowedRoles={[Role.SUPER_ADMIN]}>
            <DashboardLayout navItems={navItems} title="Users Management">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box>
                        <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
                            Platform Users
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Manage system access and clinic administrators.
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
                        Add Clinic Admin
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
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>User</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Role</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Clinic</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textAlign: 'right' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                                                No users found.
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
                                                            {user.email} {user.phone ? `• ${user.phone}` : ''}
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
                                                        {user.clinic ? (
                                                            <Typography variant="body2" fontWeight={500} color="primary.dark">
                                                                {user.clinic.name}
                                                            </Typography>
                                                        ) : (
                                                            <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                                                N/A
                                                            </Typography>
                                                        )}
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
                                                        {user.role !== Role.SUPER_ADMIN && (
                                                            <>
                                                                <Tooltip title="Edit User">
                                                                    <IconButton color="primary" onClick={() => handleOpenEdit(user)}>
                                                                        <EditIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                {user.isActive && (
                                                                    <Tooltip title="Deactivate User">
                                                                        <IconButton color="error" onClick={() => handleDeactivate(user.id, user.isActive, user.role)}>
                                                                            <BlockIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                )}
                                                            </>
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
                        {dialogMode === 'add' ? 'Add Clinic Admin' : 'Edit User'}
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
                                disabled={dialogMode === 'edit'} // Usually email is not editable easily or requires specific flow, restricting here for safety
                                value={formData.email}
                                onChange={handleFormChange('email')}
                                helperText={dialogMode === 'edit' ? "Email cannot be changed." : ""}
                            />

                            {dialogMode === 'add' && (
                                <TextField
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    required
                                    value={formData.password}
                                    onChange={handleFormChange('password')}
                                    helperText="Minimum 6 characters"
                                />
                            )}

                            <TextField
                                label="Phone Number"
                                fullWidth
                                value={formData.phone}
                                onChange={handleFormChange('phone')}
                            />

                            {dialogMode === 'add' && (
                                <TextField
                                    select
                                    label="Assign Clinic"
                                    fullWidth
                                    required
                                    value={formData.clinicId}
                                    onChange={handleFormChange('clinicId')}
                                >
                                    <MenuItem value="">
                                        <em>Select a Clinic</em>
                                    </MenuItem>
                                    {clinics.map((clinic) => (
                                        <MenuItem key={clinic.id} value={clinic.id}>
                                            {clinic.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}

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
                                (dialogMode === 'add' && (!formData.email || !formData.password || !formData.clinicId))
                            }
                            sx={{
                                background: 'linear-gradient(135deg, #00BCD4 0%, #009688 100%)',
                            }}
                        >
                            {saving ? <CircularProgress size={24} color="inherit" /> : 'Save User'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
