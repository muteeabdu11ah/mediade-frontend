export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        ME: '/auth/profile',
        CHANGE_PASSWORD: '/auth/change-password',
    },
    DOCTOR: {
        PROFILE: '/doctor/profile',
        UPDATE_PROFILE: '/doctor/profile',
        STATS: '/doctor/stats',
        AVAILABILITY: '/doctor/availability',
    },
    APPOINTMENTS: {
        BASE: '/appointments',
        DOCTOR_ME: '/appointments/doctor/me',
        DOCTOR_STATS: '/appointments/doctor/me/stats',
        CLINIC: '/appointments/clinic',
        PATIENT_ME: '/appointments/me',
        PATIENT_STATS: '/appointments/me/stats',
        ONSITE: '/onsite-consultations/doctor/me',
        ONSITE_STATS: '/onsite-consultations/doctor/me/stats',
        ONSITE_CREATE: '/onsite-consultations',
        UPDATE_STATUS: (id: string) => `/appointments/${id}/status`,
    },
    FILES: {
        UPLOAD: '/files/upload',
    },
    SCHEDULES: {
        ME: '/schedules/me',
    },
    CLINICS: {
        BASE: '/clinics',
        ONE: (id: string) => `/clinics/${id}`,
        PERMANENT: (id: string) => `/clinics/${id}/permanent`,
        PROFILE_IMAGE: (id: string) => `/clinics/${id}/profile-image`,
        STATS: (id: string) => `/clinics/${id}/stats`,
    },
    USERS: {
        BASE: '/users',
        ONE: (id: string) => `/users/${id}`,
        PERMANENT: (id: string) => `/users/${id}/permanent`,
        CLINIC_ADMIN: '/users/clinic-admin',
        DOCTOR: '/users/doctor',
        RECEPTIONIST: '/users/receptionist',
    },
} as const;

export const QUERY_KEYS = {
    USER_ME: ['user', 'me'],
    DOCTOR_PROFILE: ['doctor', 'profile'],
    DOCTOR_STATS: ['doctor', 'stats'],
    APPOINTMENTS: ['appointments'],
    CLINIC_APPOINTMENTS: ['clinic_appointments'],
    ONSITE_CONSULTATIONS: ['onsite_consultations'],
    DOCTOR_SCHEDULES: ['doctor_schedules'],
    CLINICS: ['clinics'],
    USERS: ['users'],
} as const;
