import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
const AI_API_BASE_URL = process.env.NEXT_PUBLIC_AI_API_URL || 'https://5dc3-2407-d000-1a-e92e-e530-9096-144a-a7fa.ngrok-free.app';


const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const ai_api = axios.create({
    baseURL: AI_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
// ─── Request Interceptor: attach JWT ────────────────────────────────────────

api.interceptors.request.use(
    (config) => {
        const token = Cookies.get('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// ─── Response Interceptor: handle 401 ───────────────────────────────────────

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            Cookies.remove('accessToken');
            Cookies.remove('userRole');
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    },
);

export default api;
export { ai_api };