import { IAuthRepository } from '../../interfaces/auth.repository.interface';
import { AuthEntity, RegisterData } from '../../entities/auth.entity';

export class RegisterUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(data: RegisterData): Promise<AuthEntity> {
    return await this.authRepository.register(data);
  }
}
