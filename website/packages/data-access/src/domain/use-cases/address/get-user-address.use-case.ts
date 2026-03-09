import { IAddressRepository } from '../../interfaces/address.repository.interface';
import { AddressEntity } from '../../entities/address.entity';

export class GetUserAddressUseCase {
  constructor(private addressRepository: IAddressRepository) {}

  async execute(userId: string): Promise<AddressEntity> {
    return await this.addressRepository.getUserAddress(userId);
  }
}
