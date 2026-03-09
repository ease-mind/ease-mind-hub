import { ICognitiveSettingsRepository } from '../../interfaces/cognitive-settings.repository.interface';
import { CognitiveSettingsEntity } from '../../entities/cognitive-settings.entity';

export class UpdateCognitiveSettingsUseCase {
  constructor(private cognitiveSettingsRepository: ICognitiveSettingsRepository) {}

  async execute(settings: Partial<CognitiveSettingsEntity>): Promise<CognitiveSettingsEntity> {
    return await this.cognitiveSettingsRepository.updateSettings(settings);
  }
}
