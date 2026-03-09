import { ISymptomRepository } from '../../interfaces/symptom.repository.interface';
import { SymptomEntity } from '../../entities/symptom.entity';

export class GetSymptomByIdUseCase {
  constructor(private symptomRepository: ISymptomRepository) {}

  async execute(id: string): Promise<SymptomEntity> {
    return await this.symptomRepository.getById(id);
  }
}
