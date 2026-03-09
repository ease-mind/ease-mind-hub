import { CognitiveSettingsRepository } from '../repositories/cognitive-settings.repository';
import { GetCognitiveSettingsUseCase } from '../../domain/use-cases/cognitive-settings/get-cognitive-settings.use-case';
import { UpdateCognitiveSettingsUseCase } from '../../domain/use-cases/cognitive-settings/update-cognitive-settings.use-case';
import { ResetCognitiveSettingsUseCase } from '../../domain/use-cases/cognitive-settings/reset-cognitive-settings.use-case';

export class CognitiveSettingsFactory {
  private static cognitiveSettingsRepository = new CognitiveSettingsRepository();

  static createGetCognitiveSettingsUseCase(): GetCognitiveSettingsUseCase {
    return new GetCognitiveSettingsUseCase(this.cognitiveSettingsRepository);
  }

  static createUpdateCognitiveSettingsUseCase(): UpdateCognitiveSettingsUseCase {
    return new UpdateCognitiveSettingsUseCase(this.cognitiveSettingsRepository);
  }

  static createResetCognitiveSettingsUseCase(): ResetCognitiveSettingsUseCase {
    return new ResetCognitiveSettingsUseCase(this.cognitiveSettingsRepository);
  }
}
