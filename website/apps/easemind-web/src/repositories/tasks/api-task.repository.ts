// This file is deprecated. Please use the clean architecture implementation from @repo/data-access
// Import: import { useTask, TaskEntity, CreateTaskDTO } from '@repo/data-access';

import { api } from "@repo/data-access";
import { Task, TaskRepository } from "./task.model";

/**
 * @deprecated Use the clean architecture from @repo/data-access instead
 * Example:
 * import { useTask } from '@repo/data-access';
 * const { getAllTasks, createTask, updateTask, deleteTask } = useTask();
 */
export class ApiTaskRepository implements TaskRepository {
	async getAll(): Promise<Task[]> {
		const { data } = await api.get<Task[]>("/tasks");
		return data;
	}

	async getById(id: string): Promise<Task | undefined> {
		const { data } = await api.get<Task>(`/tasks/${id}`);
		return data;
	}

	async create(task: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task> {
		const { data } = await api.post<Task>("/tasks", task);
		return data;
	}

	async update(id: string, patch: Partial<Task>): Promise<Task> {
		const { data } = await api.patch<Task>(`/tasks/${id}`, patch);
		return data;
	}

	async delete(id: string): Promise<void> {
		await api.delete(`/tasks/${id}`);
	}
}
