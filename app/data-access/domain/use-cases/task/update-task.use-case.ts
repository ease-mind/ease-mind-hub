import { ITaskRepository } from '../../interfaces/task.repository.interface';
import { TaskEntity } from '../../entities/task.entity';

export class UpdateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(id: string, patch: Partial<TaskEntity>): Promise<TaskEntity> {
    return await this.taskRepository.update(id, patch);
  }
}
