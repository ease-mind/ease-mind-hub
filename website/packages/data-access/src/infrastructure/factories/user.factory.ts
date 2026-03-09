import { UserRepository } from '../repositories/user.repository';
import { UpdateUserUseCase } from '../../domain/use-cases/user/update-user.use-case';

export class UserFactory {
  private static userRepository = new UserRepository();

  static createUpdateUserUseCase(): UpdateUserUseCase {
    return new UpdateUserUseCase(this.userRepository);
  }
}
