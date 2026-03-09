import { UserEntity } from '../entities/user.entity';

export interface IUserRepository {
  getById(id: string): Promise<UserEntity>;
  update(id: string, data: Partial<UserEntity>): Promise<UserEntity>;
  updateProfileImage(id: string, file: any): Promise<UserEntity>;
}
