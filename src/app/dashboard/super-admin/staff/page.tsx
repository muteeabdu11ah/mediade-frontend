'use client';

import { useState } from 'react';
import {
    Box,
    Button,
    Grid,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    MenuItem,
    Avatar,
    Pagination,
    Select,
    IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useUsers, useCreateClinicAdmin, useUpdateUser, useDeactivateUser, useDeleteUser } from '@/hooks/use-users';
import { useClinics } from '@/hooks/use-clinics';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Role, User } from '@/lib/types';
import { Block, DesktopAccessDisabled } from '@mui/icons-material';

export default function StaffPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all');
    const [clinicFilter, setClinicFilter] = useState<string | 'all'>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

    const { data: usersResponse, isLoading: loadingUsers } = useUsers({
        page,
        limit: 10,
        search,
        role: roleFilter === 'all' ? undefined : roleFilter,
        clinicId: clinicFilter === 'all' ? undefined : clinicFilter,
        isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
    });

    const { data: clinicsResponse } = useClinics({ limit: 100 }); // Get all for dropdowns

    const users = usersResponse?.data || [];
    const meta = usersResponse?.meta;
    const clinics = clinicsResponse?.data || [];

    const createClinicAdmin = useCreateClinicAdmin();
    const updateUser = useUpdateUser();
    const deactivateUser = useDeactivateUser();
    const deleteUser = useDeleteUser();

    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        clinicId: '',
    });

    const handleOpen = (user?: User) => {
        if (user) {
            setSelectedUser(user);
            setFormData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone || '',
                password: '',
                clinicId: user.clinicId || '',
            });
        } else {
            setSelectedUser(null);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                password: '',
                clinicId: '',
            });
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleSubmit = async () => {
        if (selectedUser) {
            await updateUser.mutateAsync({ id: selectedUser.id, payload: formData });
        } else {
            await createClinicAdmin.mutateAsync(formData);
        }
        handleClose();
    };

    const handleDeactivate = async (id: string) => {
        if (confirm('Are you sure you want to deactivate this user?')) {
            await deactivateUser.mutateAsync(id);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to PERMANENTLY delete this user? This cannot be undone.')) {
            await deleteUser.mutateAsync(id);
        }
    };

    return (
        <ProtectedRoute allowedRoles={[Role.SUPER_ADMIN]}>
            <DashboardLayout title="Staff Management">
                <Box sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Typography variant="h5" fontWeight={700} sx={{ color: '#1A2B3C' }}>
                            All Users
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
                            Add Clinic Admin
                        </Button>
                    </Box>

                    {/* Filters Section */}
                    <Paper sx={{ p: 2, mb: 4, borderRadius: 4, boxShadow: '0 4px 24px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    placeholder="Search by name or email..."
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                    InputProps={{ startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} /> }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 2 }}>
                                <Select
                                    fullWidth
                                    value={roleFilter}
                                    onChange={(e) => { setRoleFilter(e.target.value as any); setPage(1); }}
                                    sx={{ borderRadius: 3 }}
                                >
                                    <MenuItem value="all">All Roles</MenuItem>
                                    {Object.values(Role).map((r) => (
                                        <MenuItem key={r} value={r}>{r.replace('_', ' ')}</MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <Select
                                    fullWidth
                                    value={clinicFilter}
                                    onChange={(e) => { setClinicFilter(e.target.value as any); setPage(1); }}
                                    sx={{ borderRadius: 3 }}
                                >
                                    <MenuItem value="all">All Clinics</MenuItem>
                                    {clinics.map((c) => (
                                        <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <Select
                                    fullWidth
                                    value={statusFilter}
                                    onChange={(e) => { setStatusFilter(e.target.value as any); setPage(1); }}
                                    sx={{ borderRadius: 3 }}
                                >
                                    <MenuItem value="all">All Status</MenuItem>
                                    <MenuItem value="active">Active</MenuItem>
                                    <MenuItem value="inactive">Deactivated</MenuItem>
                                </Select>
                            </Grid>
                        </Grid>
                    </Paper>

                    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.04)', minHeight: 400 }}>
                        {loadingUsers ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <>
                                <Table sx={{ minWidth: 650 }}>
                                    <TableHead sx={{ bgcolor: 'rgba(46, 194, 201, 0.02)' }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 700, color: '#64748B' }}>User</TableCell>
                                            <TableCell sx={{ fontWeight: 700, color: '#64748B' }}>Role</TableCell>
                                            <TableCell sx={{ fontWeight: 700, color: '#64748B' }}>Clinic</TableCell>
                                            <TableCell sx={{ fontWeight: 700, color: '#64748B' }}>Status</TableCell>
                                            <TableCell sx={{ fontWeight: 700, color: '#64748B' }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {users.map((user) => (
                                            <TableRow key={user.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Avatar sx={{ bgcolor: 'rgba(46, 194, 201, 0.1)', color: '#2EC2C9', fontWeight: 700 }}>
                                                            {user.firstName[0]}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="body2" fontWeight={700} color="#1A2B3C">
                                                                {user.firstName} {user.lastName}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {user.email}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label={user.role.replace('_', ' ')} size="small" sx={{ textTransform: 'capitalize', fontWeight: 600, bgcolor: 'rgba(53, 200, 200, 0.05)', color: '#1fb2ba', borderRadius: 1 }} />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" color="#64748B">{user.clinic?.name || '-'}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label={user.isActive ? 'Active' : 'Deactivated'} size="small" sx={{ bgcolor: user.isActive ? 'rgba(76, 175, 80, 0.1)' : 'rgba(239, 83, 80, 0.1)', color: user.isActive ? '#4CAF50' : '#EF5350', fontWeight: 700, borderRadius: 1 }} />
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <IconButton size="small" onClick={() => handleOpen(user)} sx={{ color: '#64748B' }}><EditIcon fontSize="small" /></IconButton>
                                                        <IconButton size="small" onClick={() => handleDeactivate(user.id)} sx={{ color: '#e5e80fff' }}><Block fontSize="small" /></IconButton>
                                                        <IconButton size="small" onClick={() => handleDelete(user.id)} sx={{ color: '#D32F2F' }} title="Permanent Delete"><DeleteIcon fontSize="small" color="error" /></IconButton>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                {meta && meta.totalPages > 1 && (
                                    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                                        <Pagination count={meta.totalPages} page={page} onChange={(_, val) => setPage(val)} color="primary" />
                                    </Box>
                                )}
                            </>
                        )}
                    </TableContainer>

                    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                        <DialogTitle sx={{ fontWeight: 800, color: '#1A2B3C' }}>
                            {selectedUser ? 'Edit User' : 'Create New Clinic Admin'}
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                                <Grid container spacing={2}>
                                    <Grid size={6}>
                                        <TextField fullWidth label="First Name" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                                    </Grid>
                                    <Grid size={6}>
                                        <TextField fullWidth label="Last Name" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                                    </Grid>
                                </Grid>
                                <TextField fullWidth label="Email Address" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                <TextField fullWidth label="Phone Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                {!selectedUser && (
                                    <TextField fullWidth label="Initial Password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                                )}
                                <TextField fullWidth select label="Assign to Clinic" value={formData.clinicId} onChange={(e) => setFormData({ ...formData, clinicId: e.target.value })}>
                                    {clinics.map((clinic) => (
                                        <MenuItem key={clinic.id} value={clinic.id}>{clinic.name}</MenuItem>
                                    ))}
                                </TextField>
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ p: 3 }}>
                            <Button onClick={handleClose} sx={{ color: '#64748B', fontWeight: 600 }}>Cancel</Button>
                            <Button variant="contained" onClick={handleSubmit} disabled={createClinicAdmin.isPending || updateUser.isPending} sx={{ bgcolor: '#2EC2C9', borderRadius: 2, px: 4, fontWeight: 700, '&:hover': { bgcolor: '#24B1B8' } }}>
                                {createClinicAdmin.isPending || updateUser.isPending ? 'Saving...' : selectedUser ? 'Update User' : 'Create Admin'}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
