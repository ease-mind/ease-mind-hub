import { ISymptomRepository } from '../../interfaces/symptom.repository.interface';
import { SymptomCategoryEntity } from '../../entities/symptom.entity';

export class GetSymptomCategoriesUseCase {
  constructor(private symptomRepository: ISymptomRepository) {}

  async execute(): Promise<SymptomCategoryEntity[]> {
    return await this.symptomRepository.getCategories();
  }
}
