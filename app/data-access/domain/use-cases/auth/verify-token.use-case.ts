import { IAuthRepository } from '../../interfaces/auth.repository.interface';
import { UserEntity } from '../../entities/user.entity';

export class VerifyTokenUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(token: string): Promise<UserEntity> {
    return await this.authRepository.verifyToken(token);
  }
}
