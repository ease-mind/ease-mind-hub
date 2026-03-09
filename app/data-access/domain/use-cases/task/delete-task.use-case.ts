import { ITaskRepository } from '../../interfaces/task.repository.interface';

export class DeleteTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(id: string): Promise<void> {
    return await this.taskRepository.delete(id);
  }
}
