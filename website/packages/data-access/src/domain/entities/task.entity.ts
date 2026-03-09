export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface SubtaskEntity {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskEntity {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  estimatedMinutes: number;
  subtasks: SubtaskEntity[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  estimatedMinutes: number;
  subtasks: SubtaskEntity[];
}
