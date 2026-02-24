import { api } from '../helpers/api';
import { User } from '../classes';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
}

export interface ApiError {
    message: string;
}

export const authService = {
    /**
     * Realiza o login do usuário
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            const response = await api.post<AuthResponse>('/auth/login', credentials);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erro ao realizar login');
        }
    },

    /**
     * Realiza o cadastro de um novo usuário
     */
    async register(data: RegisterData): Promise<void> {
        try {
            await api.post('/auth/register', data);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erro ao realizar cadastro');
        }
    },

    /**
     * Verifica se o usuário está autenticado
     */
    async verifyToken(token: string): Promise<User> {
        try {
            const response = await api.get<User>('/auth/verify', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Token inválido');
        }
    },

    /**
     * Realiza o logout do usuário
     */
    async logout(): Promise<void> {
        // Limpa o usuário e token do sessionStorage
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        
        // Limpa o token do axios
        delete api.defaults.headers.common['Authorization'];
    },
};
