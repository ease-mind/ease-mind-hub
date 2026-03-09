import { ITaskRepository } from '../../interfaces/task.repository.interface';
import { TaskEntity, CreateTaskDTO } from '../../entities/task.entity';

export class CreateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(task: CreateTaskDTO): Promise<TaskEntity> {
    return await this.taskRepository.create(task);
  }
}
