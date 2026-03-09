import { AuthEntity, LoginCredentials, RegisterData } from '../entities/auth.entity';
import { UserEntity } from '../entities/user.entity';

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthEntity>;
  register(data: RegisterData): Promise<AuthEntity>;
  logout(): Promise<void>;
  verifyToken(token: string): Promise<UserEntity>;
}
