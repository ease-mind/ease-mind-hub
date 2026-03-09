import axios, { AxiosInstance } from 'axios';
import { Platform } from 'react-native';

const getDefaultBaseURL = (): string => {
    if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL.trim().replace(/\/$/, '');
    if (Platform.OS === 'android') return 'http://10.0.2.2:3000/api';
    return 'http://localhost:3000/api';
};

export const API_CONFIG = {
    BASE_URL: getDefaultBaseURL(),
    TIMEOUT: 10000,
};

export const api: AxiosInstance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const setAuthToken = (token: string | null) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export const getBaseURL = (): string => {
    return API_CONFIG.BASE_URL;
};

if (__DEV__) {
    api.interceptors.request.use(
        (config) => {
            console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
            return config;
        },
        (error) => {
            console.error('[API Request Error]', error);
            return Promise.reject(error);
        }
    );

    api.interceptors.response.use(
        (response) => {
            console.log(`📥 [API Response] ${response.status} ${response.config.url}`);
            return response;
        },
        (error) => {
            if (error.response) {
                console.error(`[API Response Error] ${error.response.status} ${error.config.url}`, error.response.data);
            } else if (error.request) {
                const url = error.config?.baseURL ?? API_CONFIG.BASE_URL;
                console.error('[API No Response]', error.message, `| URL: ${url}`);
                if (__DEV__) {
                    console.warn('[Dica] No celular físico, defina EXPO_PUBLIC_API_URL no .env com o IP do PC (ex.: http://192.168.x.x:3000/api) e use a mesma porta da API.');
                }
            } else {
                console.error('[API Error]', error.message);
            }
            return Promise.reject(error);
        }
    );
}

export default api;
