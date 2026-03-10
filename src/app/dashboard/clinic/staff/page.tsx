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
    MenuItem,
    Grid,
    Switch,
    FormControlLabel,
    Typography,
    Avatar,
    Chip,
    IconButton,
    CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import DataTable, { ColumnDef } from '@/components/DataTable';
import StatusChip from '@/components/StatusChip';
import PageHeader from '@/components/PageHeader';
import SearchFilterBar from '@/components/SearchFilterBar';
import ConfirmDialog from '@/components/ConfirmDialog';
import {
    useUsers,
    useCreateDoctor,
    useCreateReceptionist,
    useUpdateUser,
    useDeactivateUser,
} from '@/hooks/use-users';
import { Role, User } from '@/lib/types';

// ─── Types ──────────────────────────────────────────────────────────────────

interface StaffFormData {
    email: string;
    password: string;
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

// ─── Role helpers ───────────────────────────────────────────────────────────

const ROLE_STYLES: Record<string, { label: string; bgcolor: string; color: string }> = {
    [Role.DOCTOR]: { label: 'Doctor', bgcolor: 'rgba(66,165,245,0.1)', color: '#42A5F5' },
    [Role.RECEPTIONIST]: { label: 'Receptionist', bgcolor: 'rgba(255,167,38,0.1)', color: '#FFA726' },
};

// ─── Page Component ─────────────────────────────────────────────────────────

export default function ClinicStaffManagementPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // React Query
    const { data: usersResponse, isLoading } = useUsers({
        page,
        limit: 10,
        search: search || undefined,
        role: roleFilter === 'all' ? undefined : (roleFilter as Role),
        isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
    });

    const users = usersResponse?.data?.filter(
        (u) => u.role === Role.DOCTOR || u.role === Role.RECEPTIONIST
    ) || [];
    const meta = usersResponse?.meta;

    const createDoctor = useCreateDoctor();
    const createReceptionist = useCreateReceptionist();
    const updateUser = useUpdateUser();
    const deactivateUser = useDeactivateUser();

    // Dialog state
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [formData, setFormData] = useState<StaffFormData>(initialFormData);

    // Confirm dialog state
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmUserId, setConfirmUserId] = useState<string | null>(null);

    // ── Handlers ────────────────────────────────────────────────────────────

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

    const handleSave = async () => {
        if (dialogMode === 'add') {
            const payload = {
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone || undefined,
            };
            if (formData.role === Role.DOCTOR) {
                await createDoctor.mutateAsync(payload);
            } else {
                await createReceptionist.mutateAsync(payload);
            }
        } else if (selectedUserId) {
            await updateUser.mutateAsync({
                id: selectedUserId,
                payload: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone || undefined,
                    isActive: formData.isActive,
                },
            });
        }
        setOpenDialog(false);
    };

    const handleDeactivateClick = (id: string) => {
        setConfirmUserId(id);
        setConfirmOpen(true);
    };

    const handleDeactivateConfirm = async () => {
        if (confirmUserId) {
            await deactivateUser.mutateAsync(confirmUserId);
        }
        setConfirmOpen(false);
        setConfirmUserId(null);
    };

    // ── Column Definitions ──────────────────────────────────────────────────

    const columns: ColumnDef<User>[] = [
        {
            header: 'Name',
            render: (user) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                        sx={{
                            bgcolor: 'rgba(46, 194, 201, 0.1)',
                            color: '#2EC2C9',
                            fontWeight: 700,
                        }}
                    >
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
            ),
        },
        {
            header: 'Role',
            render: (user) => {
                const style = ROLE_STYLES[user.role] || { label: user.role, bgcolor: 'rgba(0,0,0,0.05)', color: 'text.secondary' };
                return (
                    <Chip
                        label={style.label}
                        size="small"
                        sx={{ bgcolor: style.bgcolor, color: style.color, fontWeight: 700, fontSize: '0.7rem', borderRadius: 1 }}
                    />
                );
            },
        },
        {
            header: 'Contact',
            render: (user) => (
                <Typography variant="body2" color="text.secondary">
                    {user.phone || 'N/A'}
                </Typography>
            ),
        },
        {
            header: 'Status',
            render: (user) => (
                <StatusChip status={user.isActive ? 'active' : 'inactive'} />
            ),
        },
        {
            header: 'Actions',
            align: 'right',
            render: (user) => (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <IconButton size="small" onClick={() => handleOpenEdit(user)} sx={{ color: '#64748B' }}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                    {user.isActive && (
                        <IconButton size="small" onClick={() => handleDeactivateClick(user.id)} sx={{ color: '#e5e80fff' }}>
                            <BlockIcon fontSize="small" />
                        </IconButton>
                    )}
                </Box>
            ),
        },
    ];

    const isSaving = createDoctor.isPending || createReceptionist.isPending || updateUser.isPending;

    // ── Render ───────────────────────────────────────────────────────────────

    return (
        <ProtectedRoute allowedRoles={[Role.CLINIC_ADMIN]}>
            <DashboardLayout title="Staff Management">
                <Box sx={{ p: 4 }}>
                    <PageHeader
                        title="Clinic Staff"
                        subtitle="Manage doctors and receptionists in your clinic."
                        actionLabel="Add Staff"
                        onAction={handleOpenAdd}
                    />

                    <SearchFilterBar
                        search={{
                            value: search,
                            onChange: (v) => { setSearch(v); setPage(1); },
                            placeholder: 'Search by name or email...',
                        }}
                        filters={[
                            {
                                value: roleFilter,
                                onChange: (v) => { setRoleFilter(v); setPage(1); },
                                options: [
                                    { value: 'all', label: 'All Roles' },
                                    { value: Role.DOCTOR, label: 'Doctor' },
                                    { value: Role.RECEPTIONIST, label: 'Receptionist' },
                                ],
                            },
                            {
                                value: statusFilter,
                                onChange: (v) => { setStatusFilter(v); setPage(1); },
                                options: [
                                    { value: 'all', label: 'All Status' },
                                    { value: 'active', label: 'Active' },
                                    { value: 'inactive', label: 'Inactive' },
                                ],
                            },
                        ]}
                    />

                    <DataTable<User>
                        columns={columns}
                        data={users}
                        isLoading={isLoading}
                        emptyMessage="No staff found in this clinic."
                        rowKey={(u) => u.id}
                        pagination={
                            meta
                                ? { page, totalPages: meta.totalPages, onPageChange: setPage }
                                : undefined
                        }
                    />

                    {/* ── Add / Edit Dialog ──────────────────────────────────── */}
                    <Dialog
                        open={openDialog}
                        onClose={() => setOpenDialog(false)}
                        maxWidth="sm"
                        fullWidth
                        PaperProps={{ sx: { borderRadius: 4 } }}
                    >
                        <DialogTitle sx={{ fontWeight: 800, color: '#1A2B3C' }}>
                            {dialogMode === 'add' ? 'Add Clinic Staff' : 'Edit Staff'}
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            label="First Name"
                                            fullWidth
                                            required
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            label="Last Name"
                                            fullWidth
                                            required
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
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
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    helperText={dialogMode === 'edit' ? 'Email cannot be changed.' : ''}
                                />

                                {dialogMode === 'add' && (
                                    <>
                                        <TextField
                                            label="Password"
                                            type="password"
                                            fullWidth
                                            required
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            helperText="Minimum 6 characters"
                                        />
                                        <TextField
                                            select
                                            label="Staff Role"
                                            fullWidth
                                            required
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value as Role.DOCTOR | Role.RECEPTIONIST })}
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
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />

                                {dialogMode === 'edit' && (
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formData.isActive}
                                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                                color="primary"
                                            />
                                        }
                                        label="Active Status"
                                    />
                                )}
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ p: 3 }}>
                            <Button onClick={() => setOpenDialog(false)} sx={{ color: '#64748B', fontWeight: 600 }}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                variant="contained"
                                disabled={
                                    isSaving ||
                                    !formData.firstName ||
                                    !formData.lastName ||
                                    (dialogMode === 'add' && (!formData.email || !formData.password || !formData.role))
                                }
                                sx={{
                                    bgcolor: '#2EC2C9',
                                    borderRadius: 2,
                                    px: 4,
                                    fontWeight: 700,
                                    '&:hover': { bgcolor: '#24B1B8' },
                                }}
                            >
                                {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Save Staff'}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* ── Confirm Deactivate Dialog ───────────────────────────── */}
                    <ConfirmDialog
                        open={confirmOpen}
                        title="Deactivate Staff"
                        message="Are you sure you want to deactivate this staff member? They will no longer be able to access the platform."
                        confirmLabel="Deactivate"
                        onConfirm={handleDeactivateConfirm}
                        onCancel={() => setConfirmOpen(false)}
                        isLoading={deactivateUser.isPending}
                    />
                </Box>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
