import { CognitiveSettingsEntity } from '../entities/cognitive-settings.entity';

export interface ICognitiveSettingsRepository {
  getSettings(): Promise<CognitiveSettingsEntity>;
  updateSettings(settings: Partial<CognitiveSettingsEntity>): Promise<CognitiveSettingsEntity>;
  resetSettings(): Promise<CognitiveSettingsEntity>;
}
