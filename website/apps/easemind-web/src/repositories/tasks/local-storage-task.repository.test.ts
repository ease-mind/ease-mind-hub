import { LocalStorageTaskRepository } from "./local-storage-task.repository";

const STORAGE_KEY = "easemind:tasks:v1";

describe("LocalStorageTaskRepository", () => {
	let repo: LocalStorageTaskRepository;

	beforeEach(() => {
		localStorage.clear();
		repo = new LocalStorageTaskRepository();
	});

	test("deve retornar seed tasks quando não há dados no storage", async () => {
		const tasks = await repo.getAll();
		expect(tasks.length).toBe(6);
	});

	test("deve persistir tasks no localStorage", async () => {
		await repo.getAll();
		const raw = localStorage.getItem(STORAGE_KEY);
		expect(raw).not.toBeNull();
		const parsed = JSON.parse(raw!);
		expect(parsed.length).toBe(6);
	});

	test("deve criar nova tarefa", async () => {
		const newTask = await repo.create({
			title: "Tarefa teste",
			description: "Descrição teste",
			priority: "medium",
			status: "todo",
			estimatedMinutes: 15,
			subtasks: []
		});

		expect(newTask.id).toBeDefined();
		expect(newTask.title).toBe("Tarefa teste");
		expect(newTask.createdAt).toBeDefined();
		expect(newTask.updatedAt).toBeDefined();

		const all = await repo.getAll();
		expect(all.length).toBe(7);
	});

	test("deve buscar tarefa por id", async () => {
		const tasks = await repo.getAll();
		const firstId = tasks[0].id;
		const found = await repo.getById(firstId);
		expect(found).toBeDefined();
		expect(found!.id).toBe(firstId);
	});

	test("deve retornar undefined para id inexistente", async () => {
		const found = await repo.getById("nao-existe");
		expect(found).toBeUndefined();
	});

	test("deve atualizar tarefa existente", async () => {
		const tasks = await repo.getAll();
		const task = tasks[0];
		const updated = await repo.update(task.id, { title: "Título atualizado" });

		expect(updated.title).toBe("Título atualizado");
		expect(updated.id).toBe(task.id);
		expect(updated.updatedAt).not.toBe(task.updatedAt);
	});

	test("deve lançar erro ao atualizar tarefa inexistente", async () => {
		await expect(repo.update("nao-existe", { title: "X" })).rejects.toThrow(
			"Task nao-existe not found"
		);
	});

	test("deve deletar tarefa", async () => {
		const tasks = await repo.getAll();
		const id = tasks[0].id;
		await repo.delete(id);
		const remaining = await repo.getAll();
		expect(remaining.length).toBe(5);
		expect(remaining.find(t => t.id === id)).toBeUndefined();
	});

	test("deve manter dados após criar e buscar novamente", async () => {
		await repo.create({
			title: "Persistência",
			description: "Teste de persistência",
			priority: "high",
			status: "todo",
			estimatedMinutes: 10,
			subtasks: [{ id: "s1", title: "Sub1", completed: false }]
		});

		const newRepo = new LocalStorageTaskRepository();
		const tasks = await newRepo.getAll();
		const found = tasks.find(t => t.title === "Persistência");
		expect(found).toBeDefined();
		expect(found!.subtasks.length).toBe(1);
	});
});
