import axios from 'axios';

const BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  let token = sessionStorage.getItem('token');
  if (token) {
    token = token.replace(/^"|"$/g, '');
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);
