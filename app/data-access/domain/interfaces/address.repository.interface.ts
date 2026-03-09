import { AddressEntity } from '../entities/address.entity';

export interface IAddressRepository {
  getUserAddress(userId: string): Promise<AddressEntity>;
  updateUserAddress(userId: string, address: AddressEntity): Promise<AddressEntity>;
}
