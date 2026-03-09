import { ITaskRepository } from '../../interfaces/task.repository.interface';
import { TaskEntity } from '../../entities/task.entity';

export class GetAllTasksUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(): Promise<TaskEntity[]> {
    return await this.taskRepository.getAll();
  }
}
