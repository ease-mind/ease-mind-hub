import { ISymptomRepository } from '../../interfaces/symptom.repository.interface';
import { UserSymptomRecordEntity } from '../../entities/symptom.entity';

export class SaveUserSymptomsUseCase {
  constructor(private symptomRepository: ISymptomRepository) {}

  async execute(data: UserSymptomRecordEntity): Promise<any> {
    return await this.symptomRepository.saveUserSymptoms(data);
  }
}
