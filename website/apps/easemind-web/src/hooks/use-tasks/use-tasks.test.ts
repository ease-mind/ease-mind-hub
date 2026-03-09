import { act, renderHook, waitFor } from "@testing-library/react";
import { useTasks } from "./use-tasks";

const mockTasks = [
	{
		id: "task-1",
		title: "Tarefa 1",
		description: "Desc 1",
		priority: "high" as const,
		status: "todo" as const,
		estimatedMinutes: 30,
		subtasks: [],
		createdAt: "2025-01-01T00:00:00.000Z",
		updatedAt: "2025-01-01T00:00:00.000Z"
	},
	{
		id: "task-2",
		title: "Tarefa 2",
		description: "Desc 2",
		priority: "medium" as const,
		status: "todo" as const,
		estimatedMinutes: 20,
		subtasks: [],
		createdAt: "2025-01-01T00:00:00.000Z",
		updatedAt: "2025-01-01T00:00:00.000Z"
	},
	{
		id: "task-3",
		title: "Tarefa 3",
		description: "Desc 3",
		priority: "low" as const,
		status: "todo" as const,
		estimatedMinutes: 15,
		subtasks: [],
		createdAt: "2025-01-01T00:00:00.000Z",
		updatedAt: "2025-01-01T00:00:00.000Z"
	},
	{
		id: "task-4",
		title: "Tarefa 4",
		description: "Desc 4",
		priority: "high" as const,
		status: "in-progress" as const,
		estimatedMinutes: 45,
		subtasks: [],
		createdAt: "2025-01-01T00:00:00.000Z",
		updatedAt: "2025-01-01T00:00:00.000Z"
	},
	{
		id: "task-5",
		title: "Tarefa 5",
		description: "Desc 5",
		priority: "medium" as const,
		status: "done" as const,
		estimatedMinutes: 25,
		subtasks: [],
		createdAt: "2025-01-01T00:00:00.000Z",
		updatedAt: "2025-01-01T00:00:00.000Z"
	},
	{
		id: "task-6",
		title: "Tarefa 6",
		description: "Desc 6",
		priority: "low" as const,
		status: "done" as const,
		estimatedMinutes: 10,
		subtasks: [],
		createdAt: "2025-01-01T00:00:00.000Z",
		updatedAt: "2025-01-01T00:00:00.000Z"
	}
];

const mockGetAll = jest.fn().mockResolvedValue(mockTasks);
const mockGetById = jest.fn();
const mockCreate = jest.fn().mockImplementation(async (data: any) => ({
	...data,
	id: "new-task",
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString()
}));
const mockUpdate = jest.fn().mockImplementation(async (id: string, patch: any) => {
	const task = mockTasks.find(t => t.id === id);
	return { ...task, ...patch, updatedAt: new Date().toISOString() };
});
const mockDelete = jest.fn().mockResolvedValue(undefined);

jest.mock("../../repositories/tasks", () => ({
	ApiTaskRepository: jest.fn().mockImplementation(() => ({
		getAll: mockGetAll,
		getById: mockGetById,
		create: mockCreate,
		update: mockUpdate,
		delete: mockDelete
	})),
}));

describe("useTasks", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockGetAll.mockResolvedValue([...mockTasks]);
	});

	test("deve carregar tarefas da API inicialmente", async () => {
		const { result } = renderHook(() => useTasks());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.tasks.length).toBe(6);
		expect(result.current.totalTasks).toBe(6);
		expect(mockGetAll).toHaveBeenCalledTimes(1);
	});

	test("deve separar tarefas por status", async () => {
		const { result } = renderHook(() => useTasks());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.todoTasks.length).toBe(3);
		expect(result.current.inProgressTasks.length).toBe(1);
		expect(result.current.doneTasks.length).toBe(2);
		expect(result.current.completedCount).toBe(2);
	});

	test("deve criar nova tarefa via API", async () => {
		const { result } = renderHook(() => useTasks());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		await act(async () => {
			await result.current.createTask({
				title: "Nova tarefa",
				description: "Descrição",
				priority: "medium",
				status: "todo",
				estimatedMinutes: 20,
				subtasks: []
			});
		});

		expect(mockCreate).toHaveBeenCalledTimes(1);
		expect(result.current.tasks.length).toBe(7);
		expect(result.current.todoTasks.length).toBe(4);
	});

	test("deve atualizar tarefa existente via API", async () => {
		const { result } = renderHook(() => useTasks());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		const task = result.current.tasks[0];

		await act(async () => {
			await result.current.updateTask(task.id, { title: "Atualizado" });
		});

		expect(mockUpdate).toHaveBeenCalledWith(task.id, { title: "Atualizado" });
		const updated = result.current.tasks.find(t => t.id === task.id);
		expect(updated?.title).toBe("Atualizado");
	});

	test("deve mover tarefa para outro status via API", async () => {
		const { result } = renderHook(() => useTasks());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		const todoTask = result.current.todoTasks[0];

		await act(async () => {
			await result.current.moveTask(todoTask.id, "in-progress");
		});

		expect(mockUpdate).toHaveBeenCalledWith(todoTask.id, { status: "in-progress" });
		expect(result.current.todoTasks.length).toBe(2);
		expect(result.current.inProgressTasks.length).toBe(2);
	});

	test("deve deletar tarefa via API", async () => {
		const { result } = renderHook(() => useTasks());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		const task = result.current.tasks[0];

		await act(async () => {
			await result.current.deleteTask(task.id);
		});

		expect(mockDelete).toHaveBeenCalledWith(task.id);
		expect(result.current.tasks.length).toBe(5);
		expect(result.current.tasks.find(t => t.id === task.id)).toBeUndefined();
	});

	test("deve chamar API ao criar tarefa, sem usar localStorage", async () => {
		const { result } = renderHook(() => useTasks());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		await act(async () => {
			await result.current.createTask({
				title: "Persistida",
				description: "Teste",
				priority: "low",
				status: "todo",
				estimatedMinutes: 5,
				subtasks: []
			});
		});

		expect(mockCreate).toHaveBeenCalledTimes(1);
		expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({ title: "Persistida" }));
	});
});
