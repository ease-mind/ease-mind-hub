import { IAddressRepository } from '../../domain/interfaces/address.repository.interface';
import { AddressEntity } from '../../domain/entities/address.entity';
import { api } from '../http/api-client';

export class AddressRepository implements IAddressRepository {
  async getUserAddress(userId: string): Promise<AddressEntity> {
    try {
      const response = await api.get<AddressEntity>(`/users/${userId}/address`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar endereço');
    }
  }

  async updateUserAddress(userId: string, address: AddressEntity): Promise<AddressEntity> {
    try {
      const response = await api.put<AddressEntity>(`/users/${userId}/address`, address);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar endereço');
    }
  }
}
