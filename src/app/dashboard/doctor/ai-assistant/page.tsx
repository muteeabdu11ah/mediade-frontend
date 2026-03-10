'use client';

import React from 'react';
import { Box } from '@mui/material';
import ChatInterface from './components/ChatInterface';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Role } from '@/lib/types';
import DashboardLayout from '@/components/DashboardLayout';

export default function AiAssistantPage() {
    return (
        <ProtectedRoute allowedRoles={[Role.DOCTOR]}>
            <DashboardLayout title="AI Assistant">
                <Box sx={{ height: '100%', width: '100%' }}>
                    <ChatInterface />
                </Box>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
