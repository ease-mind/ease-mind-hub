import { act, renderHook, waitFor } from "@testing-library/react";
import { useTasks } from "./use-tasks";

const STORAGE_KEY = "easemind:tasks:v1";

describe("useTasks", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	test("deve carregar tarefas seed inicialmente", async () => {
		const { result } = renderHook(() => useTasks());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.tasks.length).toBe(6);
		expect(result.current.totalTasks).toBe(6);
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

	test("deve criar nova tarefa", async () => {
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

		expect(result.current.tasks.length).toBe(7);
		expect(result.current.todoTasks.length).toBe(4);
	});

	test("deve atualizar tarefa existente", async () => {
		const { result } = renderHook(() => useTasks());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		const task = result.current.tasks[0];

		await act(async () => {
			await result.current.updateTask(task.id, { title: "Atualizado" });
		});

		const updated = result.current.tasks.find(t => t.id === task.id);
		expect(updated?.title).toBe("Atualizado");
	});

	test("deve mover tarefa para outro status", async () => {
		const { result } = renderHook(() => useTasks());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		const todoTask = result.current.todoTasks[0];

		await act(async () => {
			await result.current.moveTask(todoTask.id, "in-progress");
		});

		expect(result.current.todoTasks.length).toBe(2);
		expect(result.current.inProgressTasks.length).toBe(2);
	});

	test("deve deletar tarefa", async () => {
		const { result } = renderHook(() => useTasks());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		const task = result.current.tasks[0];

		await act(async () => {
			await result.current.deleteTask(task.id);
		});

		expect(result.current.tasks.length).toBe(5);
		expect(result.current.tasks.find(t => t.id === task.id)).toBeUndefined();
	});

	test("deve persistir tarefas no localStorage", async () => {
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

		const raw = localStorage.getItem(STORAGE_KEY);
		expect(raw).not.toBeNull();
		const stored = JSON.parse(raw!);
		expect(stored.find((t: any) => t.title === "Persistida")).toBeDefined();
	});
});
