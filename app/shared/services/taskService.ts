import { api } from '@/shared/config/api';

export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface SubtaskDto {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskDto {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: TaskPriority;
  status: TaskStatus;
  estimatedMinutes: number;
  subtasks: SubtaskDto[];
  createdAt: string;
  updatedAt: string;
}

export type CreateTaskPayload = Omit<TaskDto, 'id' | 'createdAt' | 'updatedAt'>;

export async function getAllTasks(): Promise<TaskDto[]> {
  const { data } = await api.get<TaskDto[]>('/tasks');
  return data;
}

export async function getTaskById(id: string): Promise<TaskDto> {
  const { data } = await api.get<TaskDto>(`/tasks/${id}`);
  return data;
}

export async function createTask(payload: CreateTaskPayload): Promise<TaskDto> {
  const { data } = await api.post<TaskDto>('/tasks', payload);
  return data;
}

export async function updateTask(
  id: string,
  patch: Partial<CreateTaskPayload>,
): Promise<TaskDto> {
  const { data } = await api.patch<TaskDto>(`/tasks/${id}`, patch);
  return data;
}

export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/tasks/${id}`);
}

