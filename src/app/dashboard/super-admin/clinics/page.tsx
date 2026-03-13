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
    Typography,
    IconButton,
    Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BusinessIcon from '@mui/icons-material/Business';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdvancedDataTable, { ColumnDef } from '@/components/AdvancedDataTable';
import StatusChip from '@/components/StatusChip';
import PageHeader from '@/components/PageHeader';
import ConfirmDialog from '@/components/ConfirmDialog';
import {
    useClinics,
    useCreateClinic,
    useUpdateClinic,
    useDeactivateClinic,
    useDeleteClinic,
} from '@/hooks/use-clinics';
import { Role, Clinic } from '@/lib/types';

import { GRADIENTS, COLORS, BORDER_RADIUS, SHADOWS, TYPOGRAPHY } from '@/lib/constants/design-tokens';

export default function ClinicsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<string>('all');

    const { data: clinicsResponse, isLoading } = useClinics({
        page,
        limit: 10,
        search: search || undefined,
        isActive: status === 'all' ? undefined : status === 'active',
    });

    const clinics = clinicsResponse?.data || [];
    const meta = clinicsResponse?.meta;

    const createClinic = useCreateClinic();
    const updateClinic = useUpdateClinic();
    const deactivateClinic = useDeactivateClinic();
    const deleteClinic = useDeleteClinic();

    // Dialog state
    const [open, setOpen] = useState(false);
    const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
    const [formData, setFormData] = useState({ name: '', address: '', email: '', phone: '' });

    // Confirm dialog state
    const [toggleConfirm, setToggleConfirm] = useState<Clinic | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const handleOpen = (clinic?: Clinic) => {
        if (clinic) {
            setSelectedClinic(clinic);
            setFormData({ name: clinic.name, address: clinic.address, email: clinic.email, phone: clinic.phone });
        } else {
            setSelectedClinic(null);
            setFormData({ name: '', address: '', email: '', phone: '' });
        }
        setOpen(true);
    };

    const handleSubmit = async () => {
        if (selectedClinic) {
            await updateClinic.mutateAsync({ id: selectedClinic.id, payload: formData });
        } else {
            await createClinic.mutateAsync(formData);
        }
        setOpen(false);
    };

    const handleToggleConfirm = async () => {
        if (!toggleConfirm) return;
        if (toggleConfirm.isActive) {
            await deactivateClinic.mutateAsync(toggleConfirm.id);
        } else {
            await updateClinic.mutateAsync({ id: toggleConfirm.id, payload: { isActive: true } });
        }
        setToggleConfirm(null);
    };

    // ── Column Definitions ──────────────────────────────────────────────────

    const columns: ColumnDef<Clinic>[] = [
        {
            header: 'Clinic Name',
            render: (clinic) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ p: 1, borderRadius: BORDER_RADIUS.sm, bgcolor: COLORS.primary.subtle, display: 'flex' }}>
                        <BusinessIcon sx={{ color: COLORS.primary.main, fontSize: 24 }} />
                    </Box>
                    <Typography variant="body2" color={COLORS.text.primary} sx={{ letterSpacing: '-0.2px' }}>
                        {clinic.name}
                    </Typography>
                </Box>
            ),
        },
        {
            header: 'Contact Details',
            render: (clinic) => (
                <Box>
                    <Typography variant="body2" color={COLORS.text.secondary}>{clinic.email}</Typography>
                    <Typography variant="caption" color={COLORS.text.muted}>{clinic.phone}</Typography>
                </Box>
            ),
        },
        {
            header: 'Address',
            render: (clinic) => (
                <Typography variant="body2" color={COLORS.text.secondary} noWrap title={clinic.address} sx={{ maxWidth: 200 }}>
                    {clinic.address}
                </Typography>
            ),
        },
        {
            header: 'Status',
            render: (clinic) => <StatusChip status={clinic.isActive ? 'active' : 'inactive'} />,
        },
        {
            header: 'Actions',
            align: 'center',
            render: (clinic) => (
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <IconButton size="small" onClick={() => handleOpen(clinic)} sx={{ color: COLORS.text.secondary }} title="Edit Clinic">
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => setToggleConfirm(clinic)}
                        sx={{ color: clinic.isActive ? COLORS.warning.main : COLORS.success.main }}
                        title={clinic.isActive ? 'Deactivate Clinic' : 'Activate Clinic'}
                    >
                        {clinic.isActive ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                    </IconButton>
                    <IconButton size="small" onClick={() => setDeleteConfirm(clinic.id)} sx={{ color: COLORS.error.main }} title="Permanent Delete">
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <ProtectedRoute allowedRoles={[Role.SUPER_ADMIN]}>
            <DashboardLayout title="Clinics Management">
                <Box sx={{ p: 4 }}>
                    <PageHeader
                        title="All Clinics"
                        subtitle="Manage healthcare facilities and their registration details"
                        actionLabel="Add New Clinic"
                        onAction={() => handleOpen()}
                    />

                    <AdvancedDataTable<Clinic>
                        columns={columns}
                        data={clinics}
                        isLoading={isLoading}
                        emptyMessage="No clinics found."
                        rowKey={(c) => c.id}
                        onSearch={(v) => { setSearch(v); setPage(1); }}
                        searchPlaceholder="Search clinics by name..."
                        statusOptions={[
                            { value: 'active', label: 'Active Only' },
                            { value: 'inactive', label: 'Inactive Only' }
                        ]}
                        statusValue={status}
                        onStatusChange={(v) => { setStatus(v); setPage(1); }}
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
                            {selectedClinic ? 'Edit Clinic' : 'Add New Clinic'}
                        </DialogTitle>
                        <DialogContent sx={{ px: 4, py: 2 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                                <TextField fullWidth label="Clinic Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                <TextField fullWidth label="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                <TextField fullWidth label="Phone Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                <TextField fullWidth multiline rows={3} label="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ p: 4 }}>
                            <Button onClick={() => setOpen(false)} sx={{ color: COLORS.text.secondary }}>Cancel</Button>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                sx={{
                                    borderRadius: BORDER_RADIUS.md,
                                    px: 4,
                                    boxShadow: SHADOWS.medium
                                }}
                            >
                                {selectedClinic ? 'Update' : 'Create'}
                            </Button>
                        </DialogActions>
                    </Dialog>


                    {/* ── Toggle Status Confirm ───────────────────────────────── */}
                    <ConfirmDialog
                        open={!!toggleConfirm}
                        title={toggleConfirm?.isActive ? 'Deactivate Clinic' : 'Activate Clinic'}
                        message={
                            toggleConfirm?.isActive
                                ? 'Are you sure you want to deactivate this clinic? All staff members will lose access.'
                                : 'Are you sure you want to activate this clinic?'
                        }
                        confirmLabel={toggleConfirm?.isActive ? 'Deactivate' : 'Activate'}
                        confirmColor={toggleConfirm?.isActive ? 'warning' : 'primary'}
                        onConfirm={handleToggleConfirm}
                        onCancel={() => setToggleConfirm(null)}
                        isLoading={deactivateClinic.isPending || updateClinic.isPending}
                    />

                    {/* ── Permanent Delete Confirm ────────────────────────────── */}
                    <ConfirmDialog
                        open={!!deleteConfirm}
                        title="Permanently Delete Clinic"
                        message="Are you sure you want to PERMANENTLY delete this clinic? This will remove all associated data and cannot be undone."
                        confirmLabel="Delete Permanently"
                        onConfirm={async () => {
                            if (deleteConfirm) await deleteClinic.mutateAsync(deleteConfirm);
                            setDeleteConfirm(null);
                        }}
                        onCancel={() => setDeleteConfirm(null)}
                        isLoading={deleteClinic.isPending}
                    />
                </Box>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
