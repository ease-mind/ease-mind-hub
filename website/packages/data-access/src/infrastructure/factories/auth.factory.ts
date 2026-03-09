import { AuthRepository } from '../repositories/auth.repository';
import { LoginUseCase } from '../../domain/use-cases/auth/login.use-case';
import { RegisterUseCase } from '../../domain/use-cases/auth/register.use-case';

export class AuthFactory {
  private static authRepository = new AuthRepository();

  static createLoginUseCase(): LoginUseCase {
    return new LoginUseCase(this.authRepository);
  }

  static createRegisterUseCase(): RegisterUseCase {
    return new RegisterUseCase(this.authRepository);
  }
}
