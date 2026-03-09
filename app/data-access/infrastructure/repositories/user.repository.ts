import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';
import { api } from '../http/api-client';

export class UserRepository implements IUserRepository {
  async getById(id: string): Promise<UserEntity> {
    try {
      const response = await api.get<UserEntity>(`/users/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar usuário');
    }
  }

  async update(id: string, data: Partial<UserEntity>): Promise<UserEntity> {
    try {
      const response = await api.put<UserEntity>(`/users/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar usuário');
    }
  }

  async updateProfileImage(id: string, file: any): Promise<UserEntity> {
    try {
      const formData = new FormData();
      formData.append('file', file as any);
      
      const response = await api.put<UserEntity>(`/users/${id}/profile-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar foto de perfil');
    }
  }
}
