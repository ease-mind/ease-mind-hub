import { api } from '../helpers/api';
import { User } from '../classes';

export interface LoginResponse {
    user: User;
    accessToken: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
    try {
        const response = await api.post('/auth/login', { email, password });
        
        // Salva o token no localStorage/sessionStorage
        if (response.data.accessToken) {
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('token', response.data.accessToken);
            }
        }
        
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Erro ao fazer login');
    }
}

export async function register(data: RegisterData): Promise<User> {
    try {
        const response = await api.post('/auth/register', data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Erro ao registrar usuário');
    }
}

export async function logout(): Promise<void> {
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
    }
}

export async function getCurrentUser(): Promise<User | null> {
    try {
        const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;
        if (!token) return null;
        
        // Aqui você pode fazer uma chamada para validar o token e obter os dados atualizados do usuário
        // const response = await api.get('/auth/me');
        // return response.data;
        
        // Por enquanto, retorna o usuário salvo na sessão
        const userStr = typeof window !== 'undefined' ? sessionStorage.getItem('user') : null;
        return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
        return null;
    }
}
