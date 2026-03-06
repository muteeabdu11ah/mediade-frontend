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
import { Role, Clinic } from '@/lib/types';
import api from '@/lib/api';

const navItems = [
    { label: 'Overview', href: '/dashboard/admin', icon: <DashboardIcon /> },
    { label: 'Clinics', href: '/dashboard/admin/clinics', icon: <BusinessIcon /> },
    { label: 'Users', href: '/dashboard/admin/users', icon: <PeopleIcon /> },
    { label: 'Analytics', href: '/dashboard/admin/analytics', icon: <BarChartIcon /> },
    { label: 'Settings', href: '/dashboard/admin/settings', icon: <SettingsIcon /> },
];

interface ClinicFormData {
    name: string;
    email: string;
    phone: string;
    address: string;
    isActive: boolean;
}

const initialFormData: ClinicFormData = {
    name: '',
    email: '',
    phone: '',
    address: '',
    isActive: true,
};

export default function ClinicsManagementPage() {
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
    const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);
    const [formData, setFormData] = useState<ClinicFormData>(initialFormData);
    const [saving, setSaving] = useState(false);

    const fetchClinics = async () => {
        try {
            setLoading(true);
            const res = await api.get<Clinic[]>('/clinics');
            setClinics(res.data);
            setError('');
        } catch (err) {
            setError('Failed to load clinics.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClinics();
    }, []);

    const handleOpenAdd = () => {
        setDialogMode('add');
        setFormData(initialFormData);
        setSelectedClinicId(null);
        setOpenDialog(true);
    };

    const handleOpenEdit = (clinic: Clinic) => {
        setDialogMode('edit');
        setFormData({
            name: clinic.name,
            email: clinic.email,
            phone: clinic.phone,
            address: clinic.address,
            isActive: clinic.isActive,
        });
        setSelectedClinicId(clinic.id);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleFormChange = (prop: keyof ClinicFormData) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = prop === 'isActive' ? event.target.checked : event.target.value;
        setFormData((prev) => ({ ...prev, [prop]: value }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            if (dialogMode === 'add') {
                await api.post('/clinics', formData);
            } else if (dialogMode === 'edit' && selectedClinicId) {
                await api.patch(`/clinics/${selectedClinicId}`, formData);
            }
            await fetchClinics();
            setOpenDialog(false);
        } catch (err: unknown) {
            const errorMessage =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Failed to save clinic.';
            setError(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const handleDeactivate = async (id: string, currentStatus: boolean) => {
        if (!currentStatus) return; // Already inactive
        if (!window.confirm('Are you sure you want to deactivate this clinic?')) return;

        try {
            await api.delete(`/clinics/${id}`);
            await fetchClinics();
        } catch (err) {
            console.error('Failed to deactivate clinic', err);
            setError('Failed to deactivate clinic.');
        }
    };

    return (
        <ProtectedRoute allowedRoles={[Role.SUPER_ADMIN]}>
            <DashboardLayout navItems={navItems} title="Clinics Management">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box>
                        <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
                            Clinics
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Manage all clinics registered on the platform.
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
                        Add Clinic
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
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Clinic Name</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Email</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Phone</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textAlign: 'right' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {clinics.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                                                No clinics found. Create one to get started.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        clinics.map((clinic) => (
                                            <TableRow key={clinic.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {clinic.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {clinic.address}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{clinic.email}</TableCell>
                                                <TableCell>{clinic.phone}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={clinic.isActive ? 'Active' : 'Inactive'}
                                                        size="small"
                                                        icon={clinic.isActive ? <CheckCircleIcon /> : <BlockIcon />}
                                                        sx={{
                                                            bgcolor: clinic.isActive ? 'rgba(102,187,106,0.1)' : 'rgba(239,83,80,0.1)',
                                                            color: clinic.isActive ? '#66BB6A' : '#EF5350',
                                                            fontWeight: 600,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Tooltip title="Edit Clinic">
                                                        <IconButton color="primary" onClick={() => handleOpenEdit(clinic)}>
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    {clinic.isActive && (
                                                        <Tooltip title="Deactivate Clinic">
                                                            <IconButton color="error" onClick={() => handleDeactivate(clinic.id, clinic.isActive)}>
                                                                <BlockIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Card>

                {/* Add/Edit Dialog */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                    <DialogTitle sx={{ fontWeight: 800 }}>
                        {dialogMode === 'add' ? 'Add New Clinic' : 'Edit Clinic'}
                    </DialogTitle>
                    <DialogContent dividers>
                        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                            <TextField
                                label="Clinic Name"
                                fullWidth
                                required
                                value={formData.name}
                                onChange={handleFormChange('name')}
                            />
                            <TextField
                                label="Email Address"
                                type="email"
                                fullWidth
                                required
                                value={formData.email}
                                onChange={handleFormChange('email')}
                            />
                            <TextField
                                label="Phone Number"
                                fullWidth
                                required
                                value={formData.phone}
                                onChange={handleFormChange('phone')}
                            />
                            <TextField
                                label="Address"
                                fullWidth
                                required
                                multiline
                                rows={2}
                                value={formData.address}
                                onChange={handleFormChange('address')}
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
                            disabled={saving || !formData.name || !formData.email || !formData.phone || !formData.address}
                            sx={{
                                background: 'linear-gradient(135deg, #00BCD4 0%, #009688 100%)',
                            }}
                        >
                            {saving ? <CircularProgress size={24} color="inherit" /> : 'Save Clinic'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
