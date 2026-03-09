export type Priority = 'alta' | 'media' | 'baixa';
export type TaskFilter = 'todas' | 'pendentes' | 'concluidas';

export const CATEGORY_OPTIONS = [
  'Rotina',
  'Trabalho',
  'Planejamento',
  'Documentação',
  'Organização',
] as const;

export type Category = typeof CATEGORY_OPTIONS[number];

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  category: Category;
  priority: Priority;
  estimatedTime: string;
  description: string;
  completed: boolean;
  subtasks: Subtask[];
  createdAt: number;
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
};
