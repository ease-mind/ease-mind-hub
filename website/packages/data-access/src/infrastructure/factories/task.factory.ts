import { TaskRepository } from '../repositories/task.repository';
import { GetAllTasksUseCase } from '../../domain/use-cases/task/get-all-tasks.use-case';
import { GetTaskByIdUseCase } from '../../domain/use-cases/task/get-task-by-id.use-case';
import { CreateTaskUseCase } from '../../domain/use-cases/task/create-task.use-case';
import { UpdateTaskUseCase } from '../../domain/use-cases/task/update-task.use-case';
import { DeleteTaskUseCase } from '../../domain/use-cases/task/delete-task.use-case';

export class TaskFactory {
  private static taskRepository = new TaskRepository();

  static createGetAllTasksUseCase(): GetAllTasksUseCase {
    return new GetAllTasksUseCase(this.taskRepository);
  }

  static createGetTaskByIdUseCase(): GetTaskByIdUseCase {
    return new GetTaskByIdUseCase(this.taskRepository);
  }

  static createCreateTaskUseCase(): CreateTaskUseCase {
    return new CreateTaskUseCase(this.taskRepository);
  }

  static createUpdateTaskUseCase(): UpdateTaskUseCase {
    return new UpdateTaskUseCase(this.taskRepository);
  }

  static createDeleteTaskUseCase(): DeleteTaskUseCase {
    return new DeleteTaskUseCase(this.taskRepository);
  }
}
