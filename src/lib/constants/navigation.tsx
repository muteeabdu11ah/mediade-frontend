import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import SettingsIcon from '@mui/icons-material/Settings';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import { Role } from '@/lib/types';
import { SmartToy } from '@mui/icons-material';

export interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}
export const SUPER_ADMIN_ITEMS: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard/super-admin', icon: <DashboardIcon /> },
    { label: 'Clinics', href: '/dashboard/super-admin/clinics', icon: <BusinessIcon /> },
    { label: 'Staff', href: '/dashboard/super-admin/staff', icon: <PeopleIcon /> },
];

export const DOCTOR_NAV_ITEMS: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard/doctor', icon: <DashboardIcon /> },
    { label: 'Appointments', href: '/dashboard/doctor/appointments', icon: <EventIcon /> },
    { label: 'Onsite Appointments', href: '/dashboard/doctor/onsite-appointments', icon: <CalendarMonthIcon /> },
    { label: 'AI Assistant', href: '/dashboard/doctor/ai-assistant', icon: <SmartToy /> },
    { label: 'Settings', href: '/dashboard/doctor/settings', icon: <SettingsIcon /> },
];

export const CLINIC_NAV_ITEMS: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard/clinic', icon: <DashboardIcon /> },
    { label: 'Appointments', href: '/dashboard/clinic/appointments', icon: <EventIcon /> },
    { label: 'Staff', href: '/dashboard/clinic/staff', icon: <PeopleIcon /> },
];

export const PATIENT_NAV_ITEMS: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard/patient', icon: <DashboardIcon /> },
    { label: 'Appointments', href: '/dashboard/patient/appointments', icon: <EventIcon /> },
    { label: 'Book Appointment', href: '/dashboard/patient/book', icon: <CalendarMonthIcon /> },
    { label: 'Profile', href: '/dashboard/patient/profile', icon: <PersonIcon /> },
];

export const RECEPTIONIST_NAV_ITEMS: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard/receptionist', icon: <DashboardIcon /> },
];

export const ROLE_DASHBOARD_ROUTES: Record<Role, string> = {
    [Role.SUPER_ADMIN]: '/dashboard/super-admin',
    [Role.CLINIC_ADMIN]: '/dashboard/clinic',
    [Role.DOCTOR]: '/dashboard/doctor',
    [Role.RECEPTIONIST]: '/dashboard/receptionist',
    [Role.PATIENT]: '/dashboard/patient',
};

export const getNavItemsByRole = (role: Role): NavItem[] => {
    switch (role) {
        case Role.SUPER_ADMIN:
            return SUPER_ADMIN_ITEMS;
        case Role.DOCTOR:
            return DOCTOR_NAV_ITEMS;
        case Role.CLINIC_ADMIN:
            return CLINIC_NAV_ITEMS;
        case Role.PATIENT:
            return PATIENT_NAV_ITEMS;
        case Role.RECEPTIONIST:
            return RECEPTIONIST_NAV_ITEMS;
        default:
            return [];
    }
};
