import { IUserRepository } from '../../interfaces/user.repository.interface';
import { UserEntity } from '../../entities/user.entity';

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string, data: Partial<UserEntity>): Promise<UserEntity> {
    return await this.userRepository.update(id, data);
  }
}
