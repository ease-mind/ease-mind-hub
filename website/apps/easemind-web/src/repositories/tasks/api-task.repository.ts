import { api } from "@repo/data-access";
import { Task, TaskRepository } from "./task.model";

// TODO: REPLACE LOCAL STORAGE WITH BACK
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
