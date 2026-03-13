import React from 'react';
import { Menu, MenuItem } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import { AppointmentStatus } from '@/lib/types';
import { COLORS } from '@/lib/constants/design-tokens';

interface StatusUpdateMenuProps {
    anchorEl: null | HTMLElement;
    onClose: () => void;
    onStatusUpdate: (status: AppointmentStatus) => void;
}

const StatusUpdateMenu: React.FC<StatusUpdateMenuProps> = ({ anchorEl, onClose, onStatusUpdate }) => {
    return (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={onClose}
            PaperProps={{ elevation: 3, sx: { borderRadius: 2, minWidth: 150, mt: 1 } }}
        >
            <MenuItem onClick={() => onStatusUpdate(AppointmentStatus.COMPLETED)} sx={{ color: COLORS.success.main }}>
                <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} /> Mark Completed
            </MenuItem>
            <MenuItem onClick={() => onStatusUpdate(AppointmentStatus.MISSED)} sx={{ color: COLORS.warning.main }}>
                <HelpOutlineIcon fontSize="small" sx={{ mr: 1 }} /> Mark No-Show
            </MenuItem>
            <MenuItem onClick={() => onStatusUpdate(AppointmentStatus.CANCELLED)} sx={{ color: COLORS.error.main }}>
                <CancelIcon fontSize="small" sx={{ mr: 1 }} /> Cancel Appointment
            </MenuItem>
        </Menu>
    );
};

export default StatusUpdateMenu;
