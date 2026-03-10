export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        ME: '/auth/me',
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
        ONSITE: '/onsite-consultations/doctor/me',
        ONSITE_CREATE: '/onsite-consultations',
        UPDATE_STATUS: (id: string) => `/appointments/${id}/status`,
    },
    FILES: {
        UPLOAD: '/files/upload',
    },
    SCHEDULES: {
        ME: '/schedules/me',
    }
} as const;

export const QUERY_KEYS = {
    USER_ME: ['user', 'me'],
    DOCTOR_PROFILE: ['doctor', 'profile'],
    DOCTOR_STATS: ['doctor', 'stats'],
    APPOINTMENTS: ['appointments'],
    ONSITE_CONSULTATIONS: ['onsite_consultations'],
    DOCTOR_SCHEDULES: ['doctor_schedules'],
} as const;
