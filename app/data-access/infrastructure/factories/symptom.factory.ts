import { SymptomRepository } from '../repositories/symptom.repository';
import { GetAllSymptomsUseCase } from '../../domain/use-cases/symptom/get-all-symptoms.use-case';
import { SaveUserSymptomsUseCase } from '../../domain/use-cases/symptom/save-user-symptoms.use-case';
import { GetLatestUserSymptomsUseCase } from '../../domain/use-cases/symptom/get-latest-user-symptoms.use-case';

export class SymptomFactory {
  private static symptomRepository = new SymptomRepository();

  static createGetAllSymptomsUseCase(): GetAllSymptomsUseCase {
    return new GetAllSymptomsUseCase(this.symptomRepository);
  }

  static createSaveUserSymptomsUseCase(): SaveUserSymptomsUseCase {
    return new SaveUserSymptomsUseCase(this.symptomRepository);
  }

  static createGetLatestUserSymptomsUseCase(): GetLatestUserSymptomsUseCase {
    return new GetLatestUserSymptomsUseCase(this.symptomRepository);
  }
}
