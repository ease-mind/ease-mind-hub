import { IAuthRepository } from '../../interfaces/auth.repository.interface';
import { AuthEntity, LoginCredentials } from '../../entities/auth.entity';

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(credentials: LoginCredentials): Promise<AuthEntity> {
    return await this.authRepository.login(credentials);
  }
}
