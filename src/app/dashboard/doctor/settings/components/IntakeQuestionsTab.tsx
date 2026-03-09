'use client';

import React from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Divider,
} from '@mui/material';

export default function IntakeQuestionsTab() {
    return (
        <Box sx={{ maxWidth: 600 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 1, color: '#2D3748' }}>
                Intake Questions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Configure questions patients must answer before booking
            </Typography>

            <Box sx={{ p: 4, bgcolor: '#F0F9FA', borderRadius: 4, textAlign: 'center', border: '2px dashed #1fb2ba', mb: 4 }}>
                <Typography variant="body1" fontWeight={600} color="#0f7e85">
                    Feature Coming Soon
                </Typography>
                <Typography variant="body2" color="#1fb2ba">
                    You'll be able to create custom intake forms here.
                </Typography>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    disabled
                    sx={{
                        px: 4,
                        py: 1,
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #00BCD4 0%, #009688 100%)',
                    }}
                >
                    Save Changes
                </Button>
            </Box>
        </Box>
    );
}
