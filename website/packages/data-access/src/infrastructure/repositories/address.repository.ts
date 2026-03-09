import { IAddressRepository } from '../../domain/interfaces/address.repository.interface';
import { AddressEntity } from '../../domain/entities/address.entity';
import { apiClient } from '../http/api-client';

export class AddressRepository implements IAddressRepository {
  async getUserAddress(userId: string): Promise<AddressEntity> {
    try {
      const response = await apiClient.get<AddressEntity>(`/users/${userId}/address`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar endereço');
    }
  }

  async updateUserAddress(userId: string, address: AddressEntity): Promise<AddressEntity> {
    try {
      const response = await apiClient.put<AddressEntity>(`/users/${userId}/address`, address);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar endereço');
    }
  }
}
