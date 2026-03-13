'use client';

import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from '@mui/material';

import { COLORS, BORDER_RADIUS, SHADOWS, TYPOGRAPHY } from '@/lib/constants/design-tokens';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmColor?: 'error' | 'primary' | 'warning';
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export default function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    confirmColor = 'error',
    onConfirm,
    onCancel,
    isLoading,
}: ConfirmDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onCancel}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: BORDER_RADIUS.lg,
                    boxShadow: SHADOWS.premium
                }
            }}
        >
            <DialogTitle sx={{ color: COLORS.text.primary, pt: 4, px: 4 }}>
                {title}
            </DialogTitle>
            <DialogContent sx={{ px: 4, pb: 1 }}>
                <DialogContentText sx={{ color: COLORS.text.secondary }}>
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 4, pt: 2 }}>
                <Button
                    onClick={onCancel}
                    sx={{
                        color: COLORS.text.muted,
                        '&:hover': { color: COLORS.text.secondary }
                    }}
                >
                    {cancelLabel}
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color={confirmColor}
                    disabled={isLoading}
                    sx={{
                        borderRadius: BORDER_RADIUS.md,
                        px: 4,
                        boxShadow: confirmColor === 'error' ? 'none' : SHADOWS.medium,
                    }}
                >
                    {isLoading ? 'Processing...' : confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
