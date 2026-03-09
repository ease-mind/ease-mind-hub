import { TaskEntity, CreateTaskDTO } from '../entities/task.entity';

export interface ITaskRepository {
  getAll(): Promise<TaskEntity[]>;
  getById(id: string): Promise<TaskEntity | undefined>;
  create(task: CreateTaskDTO): Promise<TaskEntity>;
  update(id: string, patch: Partial<TaskEntity>): Promise<TaskEntity>;
  delete(id: string): Promise<void>;
}
