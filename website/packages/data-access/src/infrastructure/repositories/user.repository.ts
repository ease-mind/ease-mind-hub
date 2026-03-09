import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { UserEntity, UserAddress } from '../../domain/entities/user.entity';
import { apiClient } from '../http/api-client';

export class UserRepository implements IUserRepository {
  async getById(id: string): Promise<UserEntity> {
    try {
      const response = await apiClient.get<UserEntity>(`/users/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar usuário');
    }
  }

  async update(id: string, data: Partial<UserEntity>): Promise<UserEntity> {
    try {
      const response = await apiClient.put<UserEntity>(`/users/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar usuário');
    }
  }

  async updateProfileImage(id: string, file: File): Promise<UserEntity> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.put<UserEntity>(`/users/${id}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar imagem');
    }
  }

  async getUserAddress(id: string): Promise<UserAddress> {
    try {
      const response = await apiClient.get<UserAddress>(`/users/${id}/address`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar endereço');
    }
    
  }
}
