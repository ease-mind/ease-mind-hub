import axios, { AxiosInstance } from 'axios';

export const API_CONFIG = {
    BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
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
                console.error('[API No Response]', error.message);
            } else {
                console.error('[API Error]', error.message);
            }
            return Promise.reject(error);
        }
    );
}

export default api;
