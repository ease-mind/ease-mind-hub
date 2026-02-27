import { useCallback, useEffect, useMemo, useState } from "react";
import { ApiTaskRepository, Task, TaskRepository, TaskStatus } from "../../repositories/tasks";

const repo: TaskRepository = new ApiTaskRepository();

export function useTasks() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [loading, setLoading] = useState(true);

	const refresh = useCallback(async () => {
		setLoading(true);
		const all = await repo.getAll();
		setTasks(all);
		setLoading(false);
	}, []);

	useEffect(() => {
		refresh();
	}, [refresh]);

	const createTask = useCallback(async (data: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
		const created = await repo.create(data);
		setTasks(prev => [...prev, created]);
		return created;
	}, []);

	const updateTask = useCallback(async (id: string, patch: Partial<Task>) => {
		const updated = await repo.update(id, patch);
		setTasks(prev => prev.map(t => (t.id === id ? updated : t)));
		return updated;
	}, []);

	const deleteTask = useCallback(async (id: string) => {
		await repo.delete(id);
		setTasks(prev => prev.filter(t => t.id !== id));
	}, []);

	const moveTask = useCallback(
		async (id: string, status: TaskStatus) => {
			return updateTask(id, { status });
		},
		[updateTask]
	);

	const todoTasks = useMemo(() => tasks.filter(t => t.status === "todo"), [tasks]);
	const inProgressTasks = useMemo(() => tasks.filter(t => t.status === "in-progress"), [tasks]);
	const doneTasks = useMemo(() => tasks.filter(t => t.status === "done"), [tasks]);

	const totalTasks = tasks.length;
	const completedCount = doneTasks.length;

	return {
		tasks,
		todoTasks,
		inProgressTasks,
		doneTasks,
		totalTasks,
		completedCount,
		loading,
		refresh,
		createTask,
		updateTask,
		deleteTask,
		moveTask
	};
}
