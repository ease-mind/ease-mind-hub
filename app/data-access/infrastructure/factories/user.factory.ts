import { UserRepository } from '../repositories/user.repository';
import { GetUserByIdUseCase } from '../../domain/use-cases/user/get-user-by-id.use-case';
import { UpdateUserUseCase } from '../../domain/use-cases/user/update-user.use-case';
import { UpdateUserProfileImageUseCase } from '../../domain/use-cases/user/update-user-profile-image.use-case';

export class UserFactory {
  private static userRepository = new UserRepository();

  static createGetUserByIdUseCase(): GetUserByIdUseCase {
    return new GetUserByIdUseCase(this.userRepository);
  }

  static createUpdateUserUseCase(): UpdateUserUseCase {
    return new UpdateUserUseCase(this.userRepository);
  }

  static createUpdateUserProfileImageUseCase(): UpdateUserProfileImageUseCase {
    return new UpdateUserProfileImageUseCase(this.userRepository);
  }
}
