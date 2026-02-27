import { Task, TaskRepository, generateId } from "./task.model";

const STORAGE_KEY = "easemind:tasks:v1";

const SEED_TASKS: Task[] = [
	{
		id: generateId(),
		title: "Revisar relatório mensal",
		description: "Revisar dados e consolidar informações do relatório mensal.",
		priority: "high",
		status: "todo",
		estimatedMinutes: 30,
		subtasks: [
			{ id: generateId(), title: "Coletar dados", completed: false },
			{ id: generateId(), title: "Revisar gráficos", completed: false },
			{ id: generateId(), title: "Enviar para aprovação", completed: false }
		],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	},
	{
		id: generateId(),
		title: "Responder e-mails importantes",
		description: "Responder e-mails urgentes de clientes e parceiros.",
		priority: "medium",
		status: "todo",
		estimatedMinutes: 20,
		subtasks: [
			{ id: generateId(), title: "E-mail do cliente A", completed: false },
			{ id: generateId(), title: "E-mail do parceiro B", completed: false }
		],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	},
	{
		id: generateId(),
		title: "Planejar reunião semanal",
		description: "Definir pauta e convidar participantes para a reunião semanal.",
		priority: "low",
		status: "todo",
		estimatedMinutes: 15,
		subtasks: [
			{ id: generateId(), title: "Definir pauta", completed: false },
			{ id: generateId(), title: "Enviar convites", completed: false }
		],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	},
	{
		id: generateId(),
		title: "Desenvolver apresentação",
		description: "Criar slides completos para reunião com cliente.",
		priority: "high",
		status: "in-progress",
		estimatedMinutes: 45,
		subtasks: [
			{ id: generateId(), title: "Criar slides", completed: true },
			{ id: generateId(), title: "Adicionar gráficos", completed: true },
			{ id: generateId(), title: "Revisar conteúdo", completed: false }
		],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	},
	{
		id: generateId(),
		title: "Atualizar documentação",
		description: "Atualizar a documentação do projeto com as últimas mudanças.",
		priority: "medium",
		status: "done",
		estimatedMinutes: 25,
		subtasks: [
			{ id: generateId(), title: "Seção de instalação", completed: true },
			{ id: generateId(), title: "Seção de API", completed: true }
		],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	},
	{
		id: generateId(),
		title: "Organizar arquivos do projeto",
		description: "Organizar e limpar arquivos desnecessários do projeto.",
		priority: "low",
		status: "done",
		estimatedMinutes: 10,
		subtasks: [
			{ id: generateId(), title: "Remover arquivos antigos", completed: true },
			{ id: generateId(), title: "Reorganizar pastas", completed: true }
		],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	}
];

export class LocalStorageTaskRepository implements TaskRepository {
	private read(): Task[] {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) return JSON.parse(raw) as Task[];
		} catch {}
		this.write(SEED_TASKS);
		return [...SEED_TASKS];
	}

	private write(tasks: Task[]): void {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
	}

	async getAll(): Promise<Task[]> {
		return this.read();
	}

	async getById(id: string): Promise<Task | undefined> {
		return this.read().find(t => t.id === id);
	}

	async create(data: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task> {
		const tasks = this.read();
		const now = new Date().toISOString();
		const task: Task = {
			...data,
			id: generateId(),
			createdAt: now,
			updatedAt: now
		};
		tasks.push(task);
		this.write(tasks);
		return task;
	}

	async update(id: string, patch: Partial<Task>): Promise<Task> {
		const tasks = this.read();
		const idx = tasks.findIndex(t => t.id === id);
		if (idx === -1) throw new Error(`Task ${id} not found`);
		const updated = { ...tasks[idx], ...patch, updatedAt: new Date().toISOString() };
		tasks[idx] = updated;
		this.write(tasks);
		return updated;
	}

	async delete(id: string): Promise<void> {
		const tasks = this.read().filter(t => t.id !== id);
		this.write(tasks);
	}
}
