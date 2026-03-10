'use client';

import React, { useState } from 'react';
import {
    Box,
    Button,
    Grid,
    Card,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Pagination,
    MenuItem,
    Select,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BusinessIcon from '@mui/icons-material/Business';
import SearchIcon from '@mui/icons-material/Search';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
    useClinics,
    useCreateClinic,
    useUpdateClinic,
    useDeactivateClinic,
    useDeleteClinic
} from '@/hooks/use-clinics';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Role, Clinic } from '@/lib/types';

export default function ClinicsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all');

    const { data: clinicsResponse, isLoading } = useClinics({
        page,
        limit: 10,
        search,
        isActive: status === 'all' ? undefined : status === 'active',
    });

    const clinics = clinicsResponse?.data || [];
    const meta = clinicsResponse?.meta;

    const createClinic = useCreateClinic();
    const updateClinic = useUpdateClinic();
    const deactivateClinic = useDeactivateClinic();
    const deleteClinic = useDeleteClinic();

    const [open, setOpen] = useState(false);
    const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        email: '',
        phone: '',
    });

    const handleOpen = (clinic?: Clinic) => {
        if (clinic) {
            setSelectedClinic(clinic);
            setFormData({
                name: clinic.name,
                address: clinic.address,
                email: clinic.email,
                phone: clinic.phone,
            });
        } else {
            setSelectedClinic(null);
            setFormData({ name: '', address: '', email: '', phone: '' });
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleSubmit = async () => {
        if (selectedClinic) {
            await updateClinic.mutateAsync({ id: selectedClinic.id, payload: formData });
        } else {
            await createClinic.mutateAsync(formData);
        }
        handleClose();
    };

    const handleToggleStatus = async (clinic: Clinic) => {
        const action = clinic.isActive ? 'deactivate' : 'activate';
        if (confirm(`Are you sure you want to ${action} this clinic?`)) {
            if (clinic.isActive) {
                await deactivateClinic.mutateAsync(clinic.id);
            } else {
                await updateClinic.mutateAsync({ id: clinic.id, payload: { isActive: true } });
            }
        }
    };

    const handleDeletePermanent = async (id: string) => {
        if (confirm('Are you sure you want to PERMANENTLY delete this clinic? This will remove all associated data and cannot be undone.')) {
            await deleteClinic.mutateAsync(id);
        }
    };

    return (
        <ProtectedRoute allowedRoles={[Role.SUPER_ADMIN]}>
            <DashboardLayout title="Clinics Management">
                <Box sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Typography variant="h5" fontWeight={700} sx={{ color: '#1A2B3C' }}>
                            All Clinics
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpen()}
                            sx={{
                                bgcolor: '#2EC2C9',
                                borderRadius: 2,
                                px: 3,
                                py: 1,
                                fontWeight: 700,
                                '&:hover': { bgcolor: '#24B1B8' },
                            }}
                        >
                            Add New Clinic
                        </Button>
                    </Box>

                    {/* Filters Section */}
                    <Card sx={{ p: 2, mb: 4, borderRadius: 4, boxShadow: '0 4px 24px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid size={{ xs: 12, md: 6 }} >
                                <TextField
                                    fullWidth
                                    placeholder="Search clinics by name..."
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setPage(1);
                                    }}
                                    InputProps={{
                                        startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <Select
                                    fullWidth
                                    value={status}
                                    onChange={(e) => {
                                        setStatus(e.target.value as any);
                                        setPage(1);
                                    }}
                                    sx={{ borderRadius: 3 }}
                                >
                                    <MenuItem value="all">All Status</MenuItem>
                                    <MenuItem value="active">Active Only</MenuItem>
                                    <MenuItem value="inactive">Inactive Only</MenuItem>
                                </Select>
                            </Grid>
                        </Grid>
                    </Card>

                    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.04)', minHeight: 400 }}>
                        {isLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <>
                                <Table sx={{ minWidth: 650 }}>
                                    <TableHead sx={{ bgcolor: 'rgba(46, 194, 201, 0.02)' }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 700, color: '#64748B' }}>Clinic Name</TableCell>
                                            <TableCell sx={{ fontWeight: 700, color: '#64748B' }}>Contact Details</TableCell>
                                            <TableCell sx={{ fontWeight: 700, color: '#64748B' }}>Address</TableCell>
                                            <TableCell sx={{ fontWeight: 700, color: '#64748B' }}>Status</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700, color: '#64748B' }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {clinics.map((clinic) => (
                                            <TableRow key={clinic.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell component="th" scope="row">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(46, 194, 201, 0.05)' }}>
                                                            <BusinessIcon sx={{ color: '#2EC2C9' }} />
                                                        </Box>
                                                        <Typography variant="body2" fontWeight={700} color="#1A2B3C">
                                                            {clinic.name}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight={500} color="#64748B">
                                                        {clinic.email}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {clinic.phone}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell sx={{ maxWidth: 200 }}>
                                                    <Typography variant="body2" color="#64748B" noWrap title={clinic.address}>
                                                        {clinic.address}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={clinic.isActive ? 'Active' : 'Inactive'}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: clinic.isActive ? 'rgba(76, 175, 80, 0.1)' : 'rgba(239, 83, 80, 0.1)',
                                                            color: clinic.isActive ? '#4CAF50' : '#EF5350',
                                                            fontWeight: 700,
                                                            borderRadius: 1,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleOpen(clinic)}
                                                            sx={{ color: '#64748B', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}
                                                            title="Edit Clinic"
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleToggleStatus(clinic)}
                                                            sx={{
                                                                color: clinic.isActive ? '#e5e80fff' : '#4CAF50',
                                                                '&:hover': { bgcolor: clinic.isActive ? 'rgba(229,232,15,0.05)' : 'rgba(76,175,80,0.05)' }
                                                            }}
                                                            title={clinic.isActive ? 'Deactivate Clinic' : 'Activate Clinic'}
                                                        >
                                                            {clinic.isActive ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleDeletePermanent(clinic.id)}
                                                            sx={{ color: '#D32F2F', '&:hover': { bgcolor: 'rgba(211,47,47,0.05)' } }}
                                                            title="Permanent Delete"
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {meta && meta.totalPages > 1 && (
                                    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                                        <Pagination
                                            count={meta.totalPages}
                                            page={page}
                                            onChange={(_, val) => setPage(val)}
                                            color="primary"
                                        />
                                    </Box>
                                )}
                            </>
                        )}
                    </TableContainer>

                    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                        <DialogTitle sx={{ fontWeight: 800, color: '#1A2B3C' }}>
                            {selectedClinic ? 'Edit Clinic' : 'Add New Clinic'}
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                                <TextField
                                    fullWidth
                                    label="Clinic Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ p: 3 }}>
                            <Button onClick={handleClose} sx={{ color: '#64748B', fontWeight: 600 }}>
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                sx={{
                                    bgcolor: '#2EC2C9',
                                    borderRadius: 2,
                                    px: 4,
                                    fontWeight: 700,
                                    '&:hover': { bgcolor: '#24B1B8' },
                                }}
                            >
                                {selectedClinic ? 'Update' : 'Create'}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
