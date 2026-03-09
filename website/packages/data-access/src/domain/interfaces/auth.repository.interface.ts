import { LoginCredentials, RegisterData, AuthResponse } from '../entities/auth.entity';
import { UserEntity } from '../entities/user.entity';

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(data: RegisterData): Promise<void>;
  verifyToken(token: string): Promise<UserEntity>;
  logout(): Promise<void>;
}
