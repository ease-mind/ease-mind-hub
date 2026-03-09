import { ITaskRepository } from '../../domain/interfaces/task.repository.interface';
import { TaskEntity, CreateTaskDTO } from '../../domain/entities/task.entity';
import { api } from '../http/api-client';

export class TaskRepository implements ITaskRepository {
  async getAll(): Promise<TaskEntity[]> {
    try {
      const response = await api.get<TaskEntity[]>('/tasks');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar tarefas');
    }
  }

  async getById(id: string): Promise<TaskEntity | undefined> {
    try {
      const response = await api.get<TaskEntity>(`/tasks/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return undefined;
      }
      throw new Error(error.response?.data?.message || 'Erro ao buscar tarefa');
    }
  }

  async create(task: CreateTaskDTO): Promise<TaskEntity> {
    try {
      const response = await api.post<TaskEntity>('/tasks', task);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao criar tarefa');
    }
  }

  async update(id: string, patch: Partial<TaskEntity>): Promise<TaskEntity> {
    try {
      const response = await api.patch<TaskEntity>(`/tasks/${id}`, patch);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar tarefa');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/tasks/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao deletar tarefa');
    }
  }
}
