import { api } from '../config/api';

export interface CognitiveSettingsData {
  complexity: 'simple' | 'complete';
  contrast: 'low' | 'normal' | 'high';
  spacing: 12 | 18 | 24;
  fontSize: 12 | 18 | 24;
  alertsEnabled: boolean;
  alertIntervalMinutes: number;
}

export const cognitiveSettingsService = {
  get: async (): Promise<CognitiveSettingsData> => {
    const response = await api.get<CognitiveSettingsData>('/cognitive-settings');
    return response.data;
  },

  update: async (settings: Partial<CognitiveSettingsData>): Promise<CognitiveSettingsData> => {
    const response = await api.put<CognitiveSettingsData>('/cognitive-settings', settings);
    return response.data;
  },

  reset: async (): Promise<CognitiveSettingsData> => {
    const response = await api.post<CognitiveSettingsData>('/cognitive-settings/reset');
    return response.data;
  },
};
