import { IAuthRepository } from '../../domain/interfaces/auth.repository.interface';
import { AuthEntity, LoginCredentials, RegisterData } from '../../domain/entities/auth.entity';
import { UserEntity } from '../../domain/entities/user.entity';
import { api } from '../http/api-client';

export class AuthRepository implements IAuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthEntity> {
    try {
      const response = await api.post<AuthEntity>('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao fazer login');
    }
  }

  async register(data: RegisterData): Promise<AuthEntity> {
    try {
      const response = await api.post<AuthEntity>('/auth/register', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao registrar');
    }
  }

  async logout(): Promise<void> {
    // Clear local storage or async storage
    // This will be handled in the context
  }

  async verifyToken(token: string): Promise<UserEntity> {
    try {
      const response = await api.get<UserEntity>('/auth/verify', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Token inválido');
    }
  }
}
