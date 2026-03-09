import { IAuthRepository } from '../../domain/interfaces/auth.repository.interface';
import { LoginCredentials, RegisterData, AuthResponse } from '../../domain/entities/auth.entity';
import { UserEntity } from '../../domain/entities/user.entity';
import { apiClient } from '../http/api-client';

export class AuthRepository implements IAuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao realizar login');
    }
  }

  async register(data: RegisterData): Promise<void> {
    try {
      await apiClient.post('/auth/register', data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao realizar cadastro');
    }
  }

  async verifyToken(token: string): Promise<UserEntity> {
    try {
      const response = await apiClient.get<UserEntity>('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Token inválido');
    }
  }

  async logout(): Promise<void> {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    delete apiClient.defaults.headers.common['Authorization'];
  }
}
