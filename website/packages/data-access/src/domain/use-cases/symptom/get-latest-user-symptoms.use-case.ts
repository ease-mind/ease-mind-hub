import { ISymptomRepository } from '../../interfaces/symptom.repository.interface';
import { UserSymptomRecordEntity } from '../../entities/symptom.entity';

export class GetLatestUserSymptomsUseCase {
  constructor(private symptomRepository: ISymptomRepository) {}

  async execute(userId: string): Promise<UserSymptomRecordEntity | null> {
    return await this.symptomRepository.getLatestUserSymptoms(userId);
  }
}
