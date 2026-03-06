import { api } from '@/shared/config/api';

export type CognitiveComplexity = 'simple' | 'complete';
export type CognitiveContrast = 'low' | 'normal' | 'high';
export type CognitiveSpacing = 12 | 14 | 18;
export type CognitiveFontSize = 14 | 16 | 18;

export interface CognitiveSettingsData {
  complexity: CognitiveComplexity;
  contrast: CognitiveContrast;
  spacing: CognitiveSpacing;
  fontSize: CognitiveFontSize;
  alertsEnabled: boolean;
  alertIntervalMinutes: number;
}

export async function getCognitiveSettings(): Promise<CognitiveSettingsData> {
  const { data } = await api.get<CognitiveSettingsData>('/cognitive-settings');
  return data;
}

export async function updateCognitiveSettings(
  settings: Partial<CognitiveSettingsData>,
): Promise<CognitiveSettingsData> {
  const { data } = await api.put<CognitiveSettingsData>('/cognitive-settings', settings);
  return data;
}

export async function resetCognitiveSettings(): Promise<CognitiveSettingsData> {
  const { data } = await api.post<CognitiveSettingsData>('/cognitive-settings/reset');
  return data;
}

