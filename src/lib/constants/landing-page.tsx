import React from 'react';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import GroupsIcon from '@mui/icons-material/Groups';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

export const FEATURES = [
    {
        icon: React.createElement(CalendarMonthIcon, { sx: { fontSize: 32 } }),
        title: 'Smart Scheduling',
        description: 'Book appointments with doctors based on their real-time availability. No more phone calls or waiting on hold.',
    },
    {
        icon: React.createElement(LocalHospitalIcon, { sx: { fontSize: 32 } }),
        title: 'Clinic Management',
        description: 'Complete clinic administration tools for managing staff, schedules, and patient records in one place.',
    },
    {
        icon: React.createElement(GroupsIcon, { sx: { fontSize: 32 } }),
        title: 'Multi-Role Access',
        description: 'Dedicated portals for patients, doctors, receptionists, clinic admins, and super administrators.',
    },
    {
        icon: React.createElement(SecurityIcon, { sx: { fontSize: 32 } }),
        title: 'HIPAA Compliant',
        description: 'Enterprise-grade security with encrypted data storage and secure access controls for medical records.',
    },
    {
        icon: React.createElement(SpeedIcon, { sx: { fontSize: 32 } }),
        title: 'Real-Time Updates',
        description: 'Instant notifications for appointment confirmations, schedule changes, and important health updates.',
    },
    {
        icon: React.createElement(SupportAgentIcon, { sx: { fontSize: 32 } }),
        title: '24/7 Support',
        description: 'Round-the-clock customer support to help you with any questions or technical issues.',
    },
];

export const STEPS = [
    { number: '01', title: 'Create Your Account', description: 'Sign up in seconds as a patient or get invited by your clinic administrator.' },
    { number: '02', title: 'Find Your Doctor', description: 'Browse available doctors and view their schedules to find the perfect appointment slot.' },
    { number: '03', title: 'Book Instantly', description: 'Select your preferred time slot and receive instant confirmation for your appointment.' },
];

export const STATS = [
    { value: '10K+', label: 'Patients Served' },
    { value: '500+', label: 'Healthcare Providers' },
    { value: '50+', label: 'Clinics Onboarded' },
    { value: '99.9%', label: 'Uptime SLA' },
];

export const HERO_HIGHLIGHTS = ['HIPAA Compliant', 'Zero Setup Cost', '24/7 Priority Support'];
