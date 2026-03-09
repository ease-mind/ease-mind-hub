import { IUserRepository } from '../../interfaces/user.repository.interface';
import { UserEntity } from '../../entities/user.entity';

export class GetUserByIdUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string): Promise<UserEntity> {
    return await this.userRepository.getById(id);
  }
}
