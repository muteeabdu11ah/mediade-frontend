'use client';

import React, { useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    Typography,
    Avatar,
    Chip,
    IconButton,
    MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Block } from '@mui/icons-material';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdvancedDataTable, { ColumnDef } from '@/components/AdvancedDataTable';
import StatusChip from '@/components/StatusChip';
import PageHeader from '@/components/PageHeader';
import ConfirmDialog from '@/components/ConfirmDialog';
import {
    useUsers,
    useCreateClinicAdmin,
    useUpdateUser,
    useDeactivateUser,
    useDeleteUser,
} from '@/hooks/use-users';
import { useClinics } from '@/hooks/use-clinics';
import { Role, User } from '@/lib/types';

import { GRADIENTS, COLORS, BORDER_RADIUS, SHADOWS, TYPOGRAPHY } from '@/lib/constants/design-tokens';

export default function StaffPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [clinicFilter, setClinicFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const { data: usersResponse, isLoading: loadingUsers } = useUsers({
        page,
        limit: 10,
        search: search || undefined,
        role: roleFilter === 'all' ? undefined : (roleFilter as Role),
        clinicId: clinicFilter === 'all' ? undefined : clinicFilter,
        isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
    });

    const { data: clinicsResponse } = useClinics({ limit: 100 });

    const users = usersResponse?.data || [];
    const meta = usersResponse?.meta;
    const clinics = clinicsResponse?.data || [];

    const createClinicAdmin = useCreateClinicAdmin();
    const updateUser = useUpdateUser();
    const deactivateUser = useDeactivateUser();
    const deleteUser = useDeleteUser();

    // Dialog state
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

    // Confirm dialogs
    const [deactivateConfirm, setDeactivateConfirm] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

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
            setFormData({ firstName: '', lastName: '', email: '', phone: '', password: '', clinicId: '' });
        }
        setOpen(true);
    };

    const handleSubmit = async () => {
        if (selectedUser) {
            await updateUser.mutateAsync({ id: selectedUser.id, payload: formData });
        } else {
            await createClinicAdmin.mutateAsync(formData);
        }
        setOpen(false);
    };

    // ── Column Definitions ──────────────────────────────────────────────────

    const columns: ColumnDef<User>[] = [
        {
            header: 'User',
            render: (user) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: COLORS.primary.subtle, color: COLORS.primary.main, fontWeight: 800 }}>
                        {user.firstName[0]}
                    </Avatar>
                    <Box>
                        <Typography variant="body2" color={COLORS.text.primary}>
                            {user.firstName} {user.lastName}
                        </Typography>
                        <Typography variant="caption" color={COLORS.text.secondary}>
                            {user.email}
                        </Typography>
                    </Box>
                </Box>
            ),
        },
        {
            header: 'Role',
            render: (user) => (
                <Chip
                    label={user.role.replace('_', ' ')}
                    size="small"
                    sx={{
                        textTransform: 'capitalize',
                        bgcolor: COLORS.primary.subtle,
                        color: COLORS.primary.main,
                        borderRadius: BORDER_RADIUS.sm,
                        border: `1px solid ${COLORS.primary.main}1A`,
                    }}
                />
            ),
        },
        {
            header: 'Clinic',
            render: (user) => (
                <Typography variant="body2" color={COLORS.text.secondary}>
                    {user.clinic?.name || '-'}
                </Typography>
            ),
        },
        {
            header: 'Status',
            render: (user) => <StatusChip status={user.isActive ? 'active' : 'inactive'} />,
        },
        {
            header: 'Actions',
            render: (user) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" onClick={() => handleOpen(user)} sx={{ color: COLORS.text.secondary }}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => setDeactivateConfirm(user.id)} sx={{ color: COLORS.warning.main }}>
                        <Block fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => setDeleteConfirm(user.id)} sx={{ color: COLORS.error.main }} title="Permanent Delete">
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <ProtectedRoute allowedRoles={[Role.SUPER_ADMIN]}>
            <DashboardLayout title="Staff Management">
                <Box sx={{ p: 4 }}>
                    <PageHeader
                        title="All Users"
                        subtitle="Manage hospital staff and clinic administrators"
                        actionLabel="Add Clinic Admin"
                        onAction={() => handleOpen()}
                    />

                    <AdvancedDataTable<User>
                        columns={columns}
                        data={users}
                        isLoading={loadingUsers}
                        emptyMessage="No users found."
                        rowKey={(u) => u.id}
                        onSearch={(v) => { setSearch(v); setPage(1); }}
                        searchPlaceholder="Search by name or email..."
                        statusOptions={[
                            { value: 'active', label: 'Active' },
                            { value: 'inactive', label: 'Deactivated' }
                        ]}
                        statusValue={statusFilter}
                        onStatusChange={(v) => { setStatusFilter(v); setPage(1); }}
                        pagination={
                            meta
                                ? { page, totalPages: meta.totalPages, onPageChange: setPage }
                                : undefined
                        }
                    />

                    {/* ── Create / Edit Dialog ───────────────────────────────── */}
                    <Dialog
                        open={open}
                        onClose={() => setOpen(false)}
                        maxWidth="sm"
                        fullWidth
                        PaperProps={{
                            sx: {
                                borderRadius: BORDER_RADIUS.lg,
                                boxShadow: SHADOWS.premium
                            }
                        }}
                    >
                        <DialogTitle sx={{ color: COLORS.text.primary, pt: 4, px: 4 }}>
                            {selectedUser ? 'Edit User' : 'Create New Clinic Admin'}
                        </DialogTitle>
                        <DialogContent sx={{ px: 4, py: 2 }}>
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
                        <DialogActions sx={{ p: 4 }}>
                            <Button onClick={() => setOpen(false)} sx={{ color: COLORS.text.secondary }}>Cancel</Button>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={createClinicAdmin.isPending || updateUser.isPending}
                                sx={{
                                    borderRadius: BORDER_RADIUS.md,
                                    px: 4,
                                    boxShadow: SHADOWS.medium
                                }}
                            >
                                {createClinicAdmin.isPending || updateUser.isPending ? 'Saving...' : selectedUser ? 'Update User' : 'Create Admin'}
                            </Button>
                        </DialogActions>
                    </Dialog>


                    {/* ── Confirm Deactivate ──────────────────────────────────── */}
                    <ConfirmDialog
                        open={!!deactivateConfirm}
                        title="Deactivate User"
                        message="Are you sure you want to deactivate this user?"
                        confirmLabel="Deactivate"
                        confirmColor="warning"
                        onConfirm={async () => {
                            if (deactivateConfirm) await deactivateUser.mutateAsync(deactivateConfirm);
                            setDeactivateConfirm(null);
                        }}
                        onCancel={() => setDeactivateConfirm(null)}
                        isLoading={deactivateUser.isPending}
                    />

                    {/* ── Confirm Delete ──────────────────────────────────────── */}
                    <ConfirmDialog
                        open={!!deleteConfirm}
                        title="Permanently Delete User"
                        message="Are you sure you want to PERMANENTLY delete this user? This cannot be undone."
                        confirmLabel="Delete Permanently"
                        onConfirm={async () => {
                            if (deleteConfirm) await deleteUser.mutateAsync(deleteConfirm);
                            setDeleteConfirm(null);
                        }}
                        onCancel={() => setDeleteConfirm(null)}
                        isLoading={deleteUser.isPending}
                    />
                </Box>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
