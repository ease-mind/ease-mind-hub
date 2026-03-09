import { ISymptomRepository } from '../../interfaces/symptom.repository.interface';
import { SymptomEntity } from '../../entities/symptom.entity';

export class GetAllSymptomsUseCase {
  constructor(private symptomRepository: ISymptomRepository) {}

  async execute(): Promise<SymptomEntity[]> {
    return await this.symptomRepository.getAll();
  }
}
