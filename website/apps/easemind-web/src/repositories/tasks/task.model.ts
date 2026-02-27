export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Subtask {
	id: string;
	title: string;
	completed: boolean;
}

export interface Task {
	id: string;
	title: string;
	description: string;
	priority: TaskPriority;
	status: TaskStatus;
	estimatedMinutes: number;
	subtasks: Subtask[];
	createdAt: string;
	updatedAt: string;
}

export interface TaskRepository {
	getAll(): Promise<Task[]>;
	getById(id: string): Promise<Task | undefined>;
	create(task: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task>;
	update(id: string, patch: Partial<Task>): Promise<Task>;
	delete(id: string): Promise<void>;
}

export function generateId(): string {
	return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function priorityLabel(p: TaskPriority): string {
	return p === "low" ? "Baixa" : p === "medium" ? "Média" : "Alta";
}

export function statusLabel(s: TaskStatus): string {
	return s === "todo" ? "A Fazer" : s === "in-progress" ? "Em Progresso" : "Concluído";
}

export function priorityColor(p: TaskPriority): string {
	return p === "low" ? "#4caf50" : p === "medium" ? "#ff9800" : "#f44336";
}
