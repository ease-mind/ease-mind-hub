import { TaskPriority, TaskStatus } from '../entities/task.entity';

export function generateTaskId(): string {
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
