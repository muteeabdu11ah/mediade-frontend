import React from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
} from '@mui/material';

interface NewOnsiteModalProps {
    open: boolean;
    onClose: () => void;
    formData: { firstName: string; lastName: string; phone: string; notes: string };
    setFormData: (data: any) => void;
    onSubmit: () => void;
    isSubmitting: boolean;
}

const NewOnsiteModal: React.FC<NewOnsiteModalProps> = ({ open, onClose, formData, setFormData, onSubmit, isSubmitting }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 700, color: '#1A2B3C' }}>New Onsite Consultation</DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            label="First Name"
                            fullWidth
                            required
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                        <TextField
                            label="Last Name"
                            fullWidth
                            required
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        />
                    </Box>
                    <TextField
                        label="Phone Number"
                        fullWidth
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <TextField
                        label="Initial Notes / Symptoms"
                        fullWidth
                        multiline
                        rows={4}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit">Cancel</Button>
                <Button
                    variant="contained"
                    disabled={!formData.firstName || !formData.lastName || isSubmitting}
                    onClick={onSubmit}
                    sx={{ bgcolor: '#1fb2ba', color: 'white', '&:hover': { bgcolor: '#148991' } }}
                >
                    {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Create & Start'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NewOnsiteModal;
