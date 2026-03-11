import SettingsIcon from '@mui/icons-material/Settings';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import { Role } from '@/lib/types';
import { BusinessOutlined, CalendarMonthOutlined, DashboardOutlined, EventOutlined, LockClock, LockClockOutlined, PeopleOutline, SmartToy } from '@mui/icons-material';
import PersonOutline from '@mui/icons-material/PersonOutline';

export interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}
export const SUPER_ADMIN_ITEMS: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard/super-admin', icon: <DashboardOutlined /> },
    { label: 'Clinics', href: '/dashboard/super-admin/clinics', icon: <BusinessOutlined /> },
    { label: 'Staff', href: '/dashboard/super-admin/staff', icon: <PeopleOutline /> },
];

export const DOCTOR_NAV_ITEMS: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard/doctor', icon: <DashboardOutlined /> },
    { label: 'Appointments', href: '/dashboard/doctor/appointments', icon: <EventOutlined /> },
    { label: 'Onsite Appointments', href: '/dashboard/doctor/onsite-appointments', icon: <CalendarMonthOutlined /> },
    { label: 'AI Assistant', href: '/dashboard/doctor/ai-assistant', icon: <SmartToy /> },
    { label: 'Settings', href: '/dashboard/doctor/settings', icon: <SettingsIcon /> },
];

export const CLINIC_NAV_ITEMS: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard/clinic', icon: <DashboardOutlined /> },
    { label: 'Appointments', href: '/dashboard/clinic/appointments', icon: <EventOutlined /> },
    { label: 'Staff', href: '/dashboard/clinic/staff', icon: <PeopleOutline /> },
];

export const PATIENT_NAV_ITEMS: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard/patient', icon: <DashboardOutlined /> },
    { label: 'Book Appointment', href: '/dashboard/patient/book', icon: <CalendarMonthOutlined /> },
    { label: 'Upcoming Appointments', href: '/dashboard/patient/appointments', icon: <EventOutlined /> },
    { label: 'History', href: '/dashboard/patient/history', icon: <LockClockOutlined /> },
    { label: 'Profile', href: '/dashboard/patient/profile', icon: <PersonOutline /> },
];

export const RECEPTIONIST_NAV_ITEMS: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard/receptionist', icon: <DashboardOutlined /> },
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
