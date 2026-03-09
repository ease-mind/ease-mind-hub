import { useState, useCallback } from 'react';
import { TaskFactory } from '../../infrastructure/factories/task.factory';
import { TaskEntity, CreateTaskDTO } from '../../domain/entities/task.entity';

export const useTask = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllTasks = useCallback(async (): Promise<TaskEntity[]> => {
    setLoading(true);
    setError(null);
    try {
      const useCase = TaskFactory.createGetAllTasksUseCase();
      const tasks = await useCase.execute();
      return tasks;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTaskById = useCallback(async (id: string): Promise<TaskEntity | undefined> => {
    setLoading(true);
    setError(null);
    try {
      const useCase = TaskFactory.createGetTaskByIdUseCase();
      const task = await useCase.execute(id);
      return task;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (task: CreateTaskDTO): Promise<TaskEntity> => {
    setLoading(true);
    setError(null);
    try {
      const useCase = TaskFactory.createCreateTaskUseCase();
      const newTask = await useCase.execute(task);
      return newTask;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (id: string, patch: Partial<TaskEntity>): Promise<TaskEntity> => {
    setLoading(true);
    setError(null);
    try {
      const useCase = TaskFactory.createUpdateTaskUseCase();
      const updatedTask = await useCase.execute(id, patch);
      return updatedTask;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const useCase = TaskFactory.createDeleteTaskUseCase();
      await useCase.execute(id);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
  };
};
