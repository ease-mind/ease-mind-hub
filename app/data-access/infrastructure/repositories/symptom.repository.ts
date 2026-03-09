import { ISymptomRepository } from '../../domain/interfaces/symptom.repository.interface';
import { SymptomEntity, SymptomCategoryEntity, UserSymptomRecordEntity } from '../../domain/entities/symptom.entity';
import { api } from '../http/api-client';

export class SymptomRepository implements ISymptomRepository {
  async getAll(): Promise<SymptomEntity[]> {
    try {
      const response = await api.get<SymptomEntity[]>('/symptoms');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar sintomas');
    }
  }

  async getById(id: string): Promise<SymptomEntity> {
    try {
      const response = await api.get<SymptomEntity>(`/symptoms/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar sintoma');
    }
  }

  async getByCategory(category: string): Promise<SymptomEntity[]> {
    try {
      const response = await api.get<SymptomEntity[]>(`/symptoms/category/${category}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || `Erro ao buscar sintomas da categoria ${category}`);
    }
  }

  async getCategories(): Promise<SymptomCategoryEntity[]> {
    try {
      const response = await api.get<SymptomCategoryEntity[]>('/symptoms/categories');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar categorias');
    }
  }

  async saveUserSymptoms(data: UserSymptomRecordEntity): Promise<any> {
    try {
      const response = await api.post('/user-symptoms', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao salvar sintomas do usuário');
    }
  }

  async getLatestUserSymptoms(userId: string): Promise<UserSymptomRecordEntity | null> {
    try {
      const response = await api.get<UserSymptomRecordEntity>(`/user-symptoms/latest/${userId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(error.response?.data?.message || 'Erro ao buscar último registro de sintomas');
    }
  }
}
