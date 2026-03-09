import { ICognitiveSettingsRepository } from '../../domain/interfaces/cognitive-settings.repository.interface';
import { CognitiveSettingsEntity } from '../../domain/entities/cognitive-settings.entity';
import { api } from '../http/api-client';

export class CognitiveSettingsRepository implements ICognitiveSettingsRepository {
  async getSettings(): Promise<CognitiveSettingsEntity> {
    try {
      const response = await api.get<CognitiveSettingsEntity>('/cognitive-settings');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar configurações cognitivas');
    }
  }

  async updateSettings(settings: Partial<CognitiveSettingsEntity>): Promise<CognitiveSettingsEntity> {
    try {
      const response = await api.put<CognitiveSettingsEntity>('/cognitive-settings', settings);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar configurações cognitivas');
    }
  }

  async resetSettings(): Promise<CognitiveSettingsEntity> {
    try {
      const response = await api.post<CognitiveSettingsEntity>('/cognitive-settings/reset');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao restaurar configurações cognitivas');
    }
  }
}
