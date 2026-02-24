import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setAuthToken } from '../config/api';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    image?: string;
    document?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
}

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            const response = await api.post<AuthResponse>('/auth/login', credentials);
            
            await AsyncStorage.setItem('token', response.data.accessToken);
            await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
            
            setAuthToken(response.data.accessToken);
            
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const message = error.response.data?.message || `Erro ${error.response.status}: ${error.response.statusText}`;
                throw new Error(message);
            } else if (error.request) {
                throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
            } else {
                throw new Error(error.message || 'Erro ao realizar login');
            }
        }
    },

    async register(data: RegisterData): Promise<void> {
        try {
            await api.post('/auth/register', data);
        } catch (error: any) {
            if (error.response) {
                const message = error.response.data?.message || `Erro ${error.response.status}: ${error.response.statusText}`;
                throw new Error(message);
            } else if (error.request) {
                throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
            } else {
                throw new Error(error.message || 'Erro ao realizar cadastro');
            }
        }
    },

    async verifyToken(token: string): Promise<User> {
        try {
            const response = await api.get<User>('/auth/verify', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const message = error.response.data?.message || 'Token inválido';
                throw new Error(message);
            } else {
                throw new Error('Erro ao verificar token');
            }
        }
    },

    async updateUser(userId: string, userData: Partial<User>): Promise<User> {
        try {
            const response = await api.put<User>(`/users/${userId}`, userData);
            await AsyncStorage.setItem('user', JSON.stringify(response.data));
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erro ao atualizar usuário');
        }
    },

    async updateUserProfileImage(userId: string, file: any): Promise<User> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await api.put<User>(`/users/${userId}/profile-image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            await AsyncStorage.setItem('user', JSON.stringify(response.data));
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erro ao atualizar foto de perfil');
        }
    },

    async getStoredUser(): Promise<User | null> {
        try {
            const userString = await AsyncStorage.getItem('user');
            return userString ? JSON.parse(userString) : null;
        } catch (error) {
            console.error('Erro ao obter usuário do storage:', error);
            return null;
        }
    },

    async getStoredToken(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem('token');
        } catch (error) {
            console.error('Erro ao obter token do storage:', error);
            return null;
        }
    },

    async logout(): Promise<void> {
        try {
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('token');
            setAuthToken(null);
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    },

    async updateStoredUser(user: User): Promise<void> {
        try {
            await AsyncStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
            console.error('Erro ao atualizar usuário no storage:', error);
        }
    },
};
