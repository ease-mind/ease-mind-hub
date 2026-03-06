import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { Task } from "../../../repositories/tasks";
import { TaskCard } from "./task-card";

describe("<TaskCard />", () => {
	const baseTask: Task = {
		id: "t-1",
		title: "Minha Tarefa",
		description: "Descrição da tarefa",
		priority: "high",
		status: "todo",
		estimatedMinutes: 30,
		subtasks: [
			{ id: "s1", title: "Sub 1", completed: true },
			{ id: "s2", title: "Sub 2", completed: false }
		],
		createdAt: "2025-01-01T00:00:00.000Z",
		updatedAt: "2025-01-01T00:00:00.000Z"
	};

	const defaultProps = {
		task: baseTask,
		isSimple: false,
		isDarkMode: false,
		cardBg: "#fff",
		borderColor: "#e5e7eb",
		textPrimary: "#111",
		textSecondary: "#666",
		onDragStart: jest.fn(),
		onFocus: jest.fn(),
		onMoveNext: jest.fn()
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("deve renderizar título da tarefa", () => {
		render(<TaskCard {...defaultProps} />);

		expect(screen.getByText("Minha Tarefa")).toBeInTheDocument();
	});

	test("deve exibir chip de prioridade no modo completo", () => {
		render(<TaskCard {...defaultProps} />);

		expect(screen.getByText("Alta")).toBeInTheDocument();
	});

	test("não deve exibir chip de prioridade no modo simples", () => {
		render(<TaskCard {...defaultProps} isSimple={true} />);

		expect(screen.queryByText("Alta")).not.toBeInTheDocument();
	});

	test("deve exibir tempo estimado no modo completo", () => {
		render(<TaskCard {...defaultProps} />);

		expect(screen.getByText("30 min")).toBeInTheDocument();
	});

	test("deve exibir contagem de subtarefas", () => {
		render(<TaskCard {...defaultProps} />);

		expect(screen.getByText("1 de 2 subtarefas")).toBeInTheDocument();
	});

	test("deve chamar onFocus ao clicar no card", () => {
		render(<TaskCard {...defaultProps} />);

		fireEvent.click(screen.getByText("Minha Tarefa"));

		expect(defaultProps.onFocus).toHaveBeenCalledTimes(1);
	});

	test("deve exibir botão de mover quando não concluída", () => {
		render(<TaskCard {...defaultProps} />);

		const moveBtn = screen.getByTitle("Mover para próximo status");
		expect(moveBtn).toBeInTheDocument();
	});

	test("deve chamar onMoveNext ao clicar no botão de mover", () => {
		render(<TaskCard {...defaultProps} />);

		const moveBtn = screen.getByTitle("Mover para próximo status");
		fireEvent.click(moveBtn);

		expect(defaultProps.onMoveNext).toHaveBeenCalledTimes(1);
	});

	test("não deve exibir botão mover quando tarefa está concluída", () => {
		const doneTask = { ...baseTask, status: "done" as const };
		render(<TaskCard {...defaultProps} task={doneTask} />);

		expect(screen.queryByTitle("Mover para próximo status")).not.toBeInTheDocument();
	});

	test("deve exibir 'subtarefas concluídas' quando done", () => {
		const doneTask = { ...baseTask, status: "done" as const };
		render(<TaskCard {...defaultProps} task={doneTask} />);

		expect(screen.getByText("2 subtarefas concluídas")).toBeInTheDocument();
	});
});
