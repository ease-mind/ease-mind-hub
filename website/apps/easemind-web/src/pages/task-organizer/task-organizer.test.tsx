import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import TaskOrganizerPage from "./task-organizer";

const mockTodoTask = {
	id: "task-1",
	title: "Tarefa Todo",
	description: "Descrição todo",
	priority: "high" as const,
	status: "todo" as const,
	estimatedMinutes: 30,
	subtasks: [
		{ id: "s1", title: "Sub 1", completed: false },
		{ id: "s2", title: "Sub 2", completed: true }
	],
	createdAt: "2025-01-01T00:00:00.000Z",
	updatedAt: "2025-01-01T00:00:00.000Z"
};

const mockInProgressTask = {
	id: "task-2",
	title: "Tarefa Em Progresso",
	description: "Descrição in-progress",
	priority: "medium" as const,
	status: "in-progress" as const,
	estimatedMinutes: 20,
	subtasks: [],
	createdAt: "2025-01-01T00:00:00.000Z",
	updatedAt: "2025-01-01T00:00:00.000Z"
};

const mockDoneTask = {
	id: "task-3",
	title: "Tarefa Concluída",
	description: "Descrição done",
	priority: "low" as const,
	status: "done" as const,
	estimatedMinutes: 10,
	subtasks: [],
	createdAt: "2025-01-01T00:00:00.000Z",
	updatedAt: "2025-01-01T00:00:00.000Z"
};

const mockCreateTask = jest.fn();
const mockUpdateTask = jest.fn().mockResolvedValue(mockTodoTask);
const mockMoveTask = jest.fn().mockResolvedValue(mockTodoTask);

jest.mock("../../hooks/use-tasks/use-tasks", () => ({
	useTasks: () => ({
		todoTasks: [mockTodoTask],
		inProgressTasks: [mockInProgressTask],
		doneTasks: [mockDoneTask],
		totalTasks: 3,
		completedCount: 1,
		loading: false,
		createTask: mockCreateTask,
		updateTask: mockUpdateTask,
		moveTask: mockMoveTask
	})
}));

jest.mock("../../hooks/use-focus-timer/use-focus-timer", () => ({
	useFocusTimer: () => ({
		state: "idle",
		display: "15:00",
		remaining: 900,
		totalSeconds: 900,
		progress: 0,
		minutes: 15,
		seconds: 0,
		start: jest.fn(),
		pause: jest.fn(),
		resume: jest.fn(),
		reset: jest.fn(),
		setMinutes: jest.fn()
	})
}));

jest.mock("../../contexts/cognitive-settings/cognitive-settings.context", () => ({
	useCognitiveSettings: () => ({
		settings: {
			complexity: "complete",
			contrast: "normal",
			spacing: 18,
			fontSize: 18,
			alertsEnabled: true,
			alertIntervalMinutes: 30
		}
	})
}));

jest.mock("@repo/utils", () => ({
	useTheme: () => ({
		colors: {
			background: "#1a1a2e",
			"background.card": "#16213e",
			"coral.500": "#FF4353",
			"coral.600": "#E63946",
			"coral.800": "#aaa",
			"coral.400": "#ff8888",
			"coral.contrast": "#ffffff"
		},
		isDarkMode: false
	})
}));

jest.mock("@repo/ui", () => ({
	EaseMindButton: ({
		label,
		onClick
	}: {
		label: string;
		onClick?: () => void;
		[key: string]: any;
	}) => <button onClick={onClick}>{label}</button>,
	EaseMindSnackbar: () => null,
	EaseMindModal: ({
		children,
		open,
		title
	}: {
		children: React.ReactNode;
		open: boolean;
		title: string;
	}) =>
		open ? (
			<div data-testid="modal">
				<span>{title}</span>
				{children}
			</div>
		) : null
}));

describe("<TaskOrganizerPage />", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("deve renderizar título e descrição", () => {
		render(<TaskOrganizerPage />);

		expect(screen.getByText("Organizador de Tarefas")).toBeInTheDocument();
		expect(
			screen.getByText("Gerencie suas atividades com suporte cognitivo inteligente")
		).toBeInTheDocument();
	});

	test("deve renderizar as três colunas do kanban", () => {
		render(<TaskOrganizerPage />);

		expect(screen.getByText("A Fazer")).toBeInTheDocument();
		expect(screen.getAllByText("Em Progresso").length).toBeGreaterThanOrEqual(1);
		expect(screen.getAllByText("Concluído").length).toBeGreaterThanOrEqual(1);
	});

	test("deve exibir tarefas nas colunas corretas", () => {
		render(<TaskOrganizerPage />);

		expect(screen.getByText("Tarefa Todo")).toBeInTheDocument();
		expect(screen.getByText("Tarefa Em Progresso")).toBeInTheDocument();
		expect(screen.getByText("Tarefa Concluída")).toBeInTheDocument();
	});

	test("deve exibir contagem de tarefas", () => {
		render(<TaskOrganizerPage />);

		expect(screen.getByText("1/3")).toBeInTheDocument();
	});

	test("deve exibir botão Nova Tarefa", () => {
		render(<TaskOrganizerPage />);

		expect(screen.getByText("Nova Tarefa")).toBeInTheDocument();
	});

	test("deve exibir painel lateral com timer no modo completo", () => {
		render(<TaskOrganizerPage />);

		expect(screen.getByText("Tempo de foco")).toBeInTheDocument();
		expect(screen.getByText("15:00")).toBeInTheDocument();
	});

	test("deve exibir painel de estatísticas no modo completo", () => {
		render(<TaskOrganizerPage />);

		expect(screen.getByText("Estatísticas")).toBeInTheDocument();
		expect(screen.getByText("Tarefas Hoje")).toBeInTheDocument();
	});

	test("deve exibir painel de dicas no modo completo", () => {
		render(<TaskOrganizerPage />);

		expect(screen.getByText("Dicas")).toBeInTheDocument();
	});

	test("deve exibir cabeçalho do quadro kanban", () => {
		render(<TaskOrganizerPage />);

		expect(screen.getByText("Quadro Kanban")).toBeInTheDocument();
	});

	test("deve exibir progresso geral", () => {
		render(<TaskOrganizerPage />);

		expect(screen.getByText("Progresso Geral")).toBeInTheDocument();
	});

	test("a descrição não deve ter capitalize indevido", () => {
		render(<TaskOrganizerPage />);

		const desc = screen.getByText("Gerencie suas atividades com suporte cognitivo inteligente");
		const style = window.getComputedStyle(desc);
		expect(style.textTransform).not.toBe("capitalize");
	});
});
