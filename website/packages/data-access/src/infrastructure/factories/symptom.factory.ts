import { SymptomRepository } from '../repositories/symptom.repository';
import { GetAllSymptomsUseCase } from '../../domain/use-cases/symptom/get-all-symptoms.use-case';
import { GetSymptomByIdUseCase } from '../../domain/use-cases/symptom/get-symptom-by-id.use-case';
import { GetSymptomsByCategoryUseCase } from '../../domain/use-cases/symptom/get-symptoms-by-category.use-case';
import { GetSymptomCategoriesUseCase } from '../../domain/use-cases/symptom/get-symptom-categories.use-case';
import { SaveUserSymptomsUseCase } from '../../domain/use-cases/symptom/save-user-symptoms.use-case';
import { GetLatestUserSymptomsUseCase } from '../../domain/use-cases/symptom/get-latest-user-symptoms.use-case';

export class SymptomFactory {
  private static symptomRepository = new SymptomRepository();

  static createGetAllSymptomsUseCase(): GetAllSymptomsUseCase {
    return new GetAllSymptomsUseCase(this.symptomRepository);
  }

  static createGetSymptomByIdUseCase(): GetSymptomByIdUseCase {
    return new GetSymptomByIdUseCase(this.symptomRepository);
  }

  static createGetSymptomsByCategoryUseCase(): GetSymptomsByCategoryUseCase {
    return new GetSymptomsByCategoryUseCase(this.symptomRepository);
  }

  static createGetSymptomCategoriesUseCase(): GetSymptomCategoriesUseCase {
    return new GetSymptomCategoriesUseCase(this.symptomRepository);
  }

  static createSaveUserSymptomsUseCase(): SaveUserSymptomsUseCase {
    return new SaveUserSymptomsUseCase(this.symptomRepository);
  }

  static createGetLatestUserSymptomsUseCase(): GetLatestUserSymptomsUseCase {
    return new GetLatestUserSymptomsUseCase(this.symptomRepository);
  }
}
