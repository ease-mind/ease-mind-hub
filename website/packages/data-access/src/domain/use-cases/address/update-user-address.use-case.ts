import { IAddressRepository } from '../../interfaces/address.repository.interface';
import { AddressEntity } from '../../entities/address.entity';

export class UpdateUserAddressUseCase {
  constructor(private addressRepository: IAddressRepository) {}

  async execute(userId: string, address: AddressEntity): Promise<AddressEntity> {
    return await this.addressRepository.updateUserAddress(userId, address);
  }
}
