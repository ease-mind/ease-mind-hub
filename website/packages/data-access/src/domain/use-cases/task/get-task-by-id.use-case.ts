import { ITaskRepository } from '../../interfaces/task.repository.interface';
import { TaskEntity } from '../../entities/task.entity';

export class GetTaskByIdUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(id: string): Promise<TaskEntity | undefined> {
    return await this.taskRepository.getById(id);
  }
}
