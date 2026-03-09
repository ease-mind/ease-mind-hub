import { AddressRepository } from '../repositories/address.repository';
import { GetUserAddressUseCase } from '../../domain/use-cases/address/get-user-address.use-case';
import { UpdateUserAddressUseCase } from '../../domain/use-cases/address/update-user-address.use-case';

export class AddressFactory {
  private static addressRepository = new AddressRepository();

  static createGetUserAddressUseCase(): GetUserAddressUseCase {
    return new GetUserAddressUseCase(this.addressRepository);
  }

  static createUpdateUserAddressUseCase(): UpdateUserAddressUseCase {
    return new UpdateUserAddressUseCase(this.addressRepository);
  }
}
