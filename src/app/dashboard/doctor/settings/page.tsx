'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    IconButton,
    Button,
    Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LockIcon from '@mui/icons-material/Lock';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Role } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';

// Sub-components
import PersonalInfoTab from './components/PersonalInfoTab';
import WorkingHoursTab from './components/WorkingHoursTab';
import ChangePasswordTab from './components/ChangePasswordTab';
import IntakeQuestionsTab from './components/IntakeQuestionsTab';

type SettingsTab = 'personal' | 'hours' | 'password' | 'questions';

export default function DoctorSettingsPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<SettingsTab>('personal');

    const sidebarItems = [
        { id: 'personal', label: 'Personal Information', icon: <PersonIcon /> },
        { id: 'hours', label: 'Working Hours', icon: <AccessTimeIcon /> },
        { id: 'password', label: 'Change Password', icon: <LockIcon /> },
        { id: 'questions', label: 'Intake Questions', icon: <HelpOutlineIcon /> },
    ];

    return (
        <ProtectedRoute allowedRoles={[Role.DOCTOR]}>
            <DashboardLayout title="Settings">
                <Box sx={{ display: 'flex', gap: 4, mt: 2, alignItems: 'flex-start' }}>

                    {/* Inner Sidebar */}
                    <Card sx={{ width: 280, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0', flexShrink: 0 }}>
                        <List sx={{ p: 1 }}>
                            {sidebarItems.map((item) => (
                                <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                                    <ListItemButton
                                        onClick={() => setActiveTab(item.id as SettingsTab)}
                                        sx={{
                                            borderRadius: 3,
                                            py: 1.5,
                                            bgcolor: activeTab === item.id ? 'primary.main' : 'transparent',
                                            color: activeTab === item.id ? 'white' : 'text.secondary',
                                            '&:hover': {
                                                bgcolor: activeTab === item.id ? 'primary.main' : 'rgba(31,178,186,0.08)',
                                            },
                                        }}
                                    >
                                        <ListItemIcon sx={{ color: activeTab === item.id ? 'white' : 'inherit', minWidth: 40 }}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.label}
                                            primaryTypographyProps={{ fontWeight: activeTab === item.id ? 700 : 500 }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Card>

                    {/* Main Content Area */}
                    <Card sx={{ flex: 1, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0', minHeight: 600 }}>
                        <CardContent sx={{ p: 4 }}>
                            {activeTab === 'personal' && <PersonalInfoTab />}
                            {activeTab === 'hours' && <WorkingHoursTab />}
                            {activeTab === 'password' && <ChangePasswordTab />}
                            {activeTab === 'questions' && <IntakeQuestionsTab />}
                        </CardContent>
                    </Card>
                </Box>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
