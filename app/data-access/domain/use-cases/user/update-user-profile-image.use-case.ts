import { IUserRepository } from '../../interfaces/user.repository.interface';
import { UserEntity } from '../../entities/user.entity';

export class UpdateUserProfileImageUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string, file: any): Promise<UserEntity> {
    return await this.userRepository.updateProfileImage(id, file);
  }
}
