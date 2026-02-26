import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { Task } from "../../../repositories/tasks";
import { KanbanColumn } from "./kanban-column";

describe("<KanbanColumn />", () => {
	const tasks: Task[] = [
		{
			id: "t-1",
			title: "Tarefa A",
			description: "Desc A",
			priority: "high",
			status: "todo",
			estimatedMinutes: 30,
			subtasks: [],
			createdAt: "2025-01-01T00:00:00.000Z",
			updatedAt: "2025-01-01T00:00:00.000Z"
		},
		{
			id: "t-2",
			title: "Tarefa B",
			description: "Desc B",
			priority: "low",
			status: "todo",
			estimatedMinutes: 15,
			subtasks: [],
			createdAt: "2025-01-01T00:00:00.000Z",
			updatedAt: "2025-01-01T00:00:00.000Z"
		}
	];

	const defaultProps = {
		title: "A Fazer",
		count: 2,
		status: "todo" as const,
		tasks,
		isSimple: false,
		isDarkMode: false,
		colBg: "#fafafa",
		cardBg: "#fff",
		borderColor: "#e5e7eb",
		textPrimary: "#111",
		textSecondary: "#666",
		onDragStart: jest.fn(),
		onDrop: jest.fn(),
		onFocus: jest.fn(),
		onMove: jest.fn()
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("deve renderizar título da coluna", () => {
		render(<KanbanColumn {...defaultProps} />);

		expect(screen.getByText("A Fazer")).toBeInTheDocument();
	});

	test("deve exibir contagem de tarefas", () => {
		render(<KanbanColumn {...defaultProps} />);

		expect(screen.getByText("2")).toBeInTheDocument();
	});

	test("deve renderizar todas as tarefas", () => {
		render(<KanbanColumn {...defaultProps} />);

		expect(screen.getByText("Tarefa A")).toBeInTheDocument();
		expect(screen.getByText("Tarefa B")).toBeInTheDocument();
	});

	test("deve chamar onFocus ao clicar em uma tarefa", () => {
		render(<KanbanColumn {...defaultProps} />);

		fireEvent.click(screen.getByText("Tarefa A"));

		expect(defaultProps.onFocus).toHaveBeenCalledWith(tasks[0]);
	});

	test("deve renderizar coluna vazia sem tarefas", () => {
		render(<KanbanColumn {...defaultProps} tasks={[]} count={0} />);

		expect(screen.getByText("A Fazer")).toBeInTheDocument();
		expect(screen.getByText("0")).toBeInTheDocument();
	});

	test("deve exibir botões de mover para status todo", () => {
		render(<KanbanColumn {...defaultProps} />);

		const moveButtons = screen.getAllByTitle("Mover para próximo status");
		expect(moveButtons.length).toBe(2);
	});

	test("não deve exibir botões de mover para status done", () => {
		const doneTasks = tasks.map(t => ({ ...t, status: "done" as const }));
		render(<KanbanColumn {...defaultProps} status="done" tasks={doneTasks} />);

		expect(screen.queryByTitle("Mover para próximo status")).not.toBeInTheDocument();
	});
});
