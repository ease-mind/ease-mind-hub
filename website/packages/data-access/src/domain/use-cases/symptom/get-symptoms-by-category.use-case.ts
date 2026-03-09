import { ISymptomRepository } from '../../interfaces/symptom.repository.interface';
import { SymptomEntity } from '../../entities/symptom.entity';

export class GetSymptomsByCategoryUseCase {
  constructor(private symptomRepository: ISymptomRepository) {}

  async execute(category: string): Promise<SymptomEntity[]> {
    return await this.symptomRepository.getByCategory(category);
  }
}
