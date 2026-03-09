import { IAuthRepository } from '../../interfaces/auth.repository.interface';
import { RegisterData } from '../../entities/auth.entity';

export class RegisterUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(data: RegisterData): Promise<void> {
    return await this.authRepository.register(data);
  }
}
