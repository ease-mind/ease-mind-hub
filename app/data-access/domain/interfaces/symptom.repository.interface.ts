import { SymptomEntity, SymptomCategoryEntity, UserSymptomRecordEntity } from '../entities/symptom.entity';

export interface ISymptomRepository {
  getAll(): Promise<SymptomEntity[]>;
  getById(id: string): Promise<SymptomEntity>;
  getByCategory(category: string): Promise<SymptomEntity[]>;
  getCategories(): Promise<SymptomCategoryEntity[]>;
  saveUserSymptoms(data: UserSymptomRecordEntity): Promise<any>;
  getLatestUserSymptoms(userId: string): Promise<UserSymptomRecordEntity | null>;
}
