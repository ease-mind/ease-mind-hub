import { ICognitiveSettingsRepository } from '../../interfaces/cognitive-settings.repository.interface';
import { CognitiveSettingsEntity } from '../../entities/cognitive-settings.entity';

export class GetCognitiveSettingsUseCase {
  constructor(private cognitiveSettingsRepository: ICognitiveSettingsRepository) {}

  async execute(): Promise<CognitiveSettingsEntity> {
    return await this.cognitiveSettingsRepository.getSettings();
  }
}
