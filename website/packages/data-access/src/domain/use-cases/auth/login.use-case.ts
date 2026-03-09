import { IAuthRepository } from '../../interfaces/auth.repository.interface';
import { LoginCredentials, AuthResponse } from '../../entities/auth.entity';

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(credentials: LoginCredentials): Promise<AuthResponse> {
    return await this.authRepository.login(credentials);
  }
}
