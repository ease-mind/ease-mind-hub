import { useState, useCallback } from 'react';
import { TaskFactory } from '../../infrastructure/factories/task.factory';
import { TaskEntity, CreateTaskDTO } from '../../domain/entities/task.entity';
import { useFeedbackAnimation } from '@/shared/hooks/useFeedbackAnimation';

export const useTask = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showFeedback, FeedbackAnimation } = useFeedbackAnimation();

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

  const createTask = useCallback(async (task: CreateTaskDTO): Promise<TaskEntity> => {
    setLoading(true);
    setError(null);
    try {
      const useCase = TaskFactory.createCreateTaskUseCase();
      const newTask = await useCase.execute(task);
      showFeedback('success');
      return newTask;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showFeedback]);

  const updateTask = useCallback(async (id: string, patch: Partial<TaskEntity>): Promise<TaskEntity> => {
    setLoading(true);
    setError(null);
    try {
      const useCase = TaskFactory.createUpdateTaskUseCase();
      const updatedTask = await useCase.execute(id, patch);
      showFeedback('success');
      return updatedTask;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showFeedback]);

  const deleteTask = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const useCase = TaskFactory.createDeleteTaskUseCase();
      await useCase.execute(id);
      showFeedback('success');
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showFeedback]);

  return {
    loading,
    error,
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
    FeedbackAnimation,
  };
};
