// ─── Enums ───────────────────────────────────────────────────────────────────

export enum Role {
    SUPER_ADMIN = 'super_admin',
    CLINIC_ADMIN = 'clinic_admin',
    DOCTOR = 'doctor',
    RECEPTIONIST = 'receptionist',
    PATIENT = 'patient',
}

export enum AppointmentStatus {
    UPCOMING = 'upcoming',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    MISSED = 'missed',
    LATE = 'late',
}

export enum DayOfWeek {
    MONDAY = 'monday',
    TUESDAY = 'tuesday',
    WEDNESDAY = 'wednesday',
    THURSDAY = 'thursday',
    FRIDAY = 'friday',
    SATURDAY = 'saturday',
    SUNDAY = 'sunday',
}

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}

// ─── Interfaces ─────────────────────────────────────────────────────────────

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    phone: string | null;
    isActive: boolean;
    clinicId: string | null;
    profileImagePath: string | null;
    clinic: ClinicSummary | null;
    createdAt: string;
    updatedAt?: string;
}

export interface ClinicSummary {
    id: string;
    name: string;
}

export interface Clinic {
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    isActive: boolean;
    profileImagePath: string | null;
    users?: UserSummary[];
    createdAt: string;
    updatedAt: string;
}

export interface UserSummary {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    isActive: boolean;
}

export interface PatientProfile {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    dateOfBirth: string | null;
    gender: Gender | null;
    bloodGroup: string | null;
    address: string | null;
    emergencyContact: string | null;
    medicalHistory: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface DoctorSchedule {
    id: string;
    doctorId: string;
    clinicId: string;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Appointment {
    id: string;
    patientId: string;
    doctorId: string;
    clinicId: string;
    appointmentDate: string;
    startTime: string;
    endTime: string;
    status: AppointmentStatus;
    notes: string | null;
    isEmergency: boolean;
    symptoms: string | null;
    escalatedBy: string | null;
    type: string;
    patient?: User;
    doctor?: User;
    clinic?: Clinic;
    createdAt: string;
    updatedAt: string;
}

// ─── Auth Types ─────────────────────────────────────────────────────────────

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    gender?: Gender;
    dateOfBirth?: string;
    bloodGroup?: string;
    address?: string;
    emergencyContact?: string;
}

export interface AuthResponse {
    message: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: Role;
        clinicId?: string | null;
    };
    accessToken: string;
}

export interface ProfileResponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    phone: string | null;
    isActive: boolean;
    clinicId: string | null;
    profileImageUrl?: string | null;
    createdAt: string;
}

// ─── Route Mapping ──────────────────────────────────────────────────────────

export interface OnsiteConsultation {
    id: string;
    doctorId: string;
    clinicId: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    notes: string | null;
    status: AppointmentStatus;
    createdAt: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
