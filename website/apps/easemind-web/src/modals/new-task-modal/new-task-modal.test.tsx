import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { NewTaskModal } from "./new-task-modal";

jest.mock("@repo/utils", () => ({
	useTheme: () => ({
		colors: {},
		isDarkMode: false
	})
}));

jest.mock("@repo/ui", () => ({
	EasemindButton: ({
		label,
		onClick
	}: {
		label: string;
		onClick?: () => void;
		[key: string]: any;
	}) => <button onClick={onClick}>{label}</button>,
	EasemindModal: ({
		children,
		open,
		title,
		onClose
	}: {
		children: React.ReactNode;
		open: boolean;
		title: string;
		onClose: () => void;
	}) =>
		open ? (
			<div data-testid="modal">
				<span>{title}</span>
				{children}
			</div>
		) : null
}));

describe("<NewTaskModal />", () => {
	const mockOnClose = jest.fn();
	const mockOnSubmit = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("não deve renderizar quando fechado", () => {
		render(<NewTaskModal open={false} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

		expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
	});

	test("deve renderizar quando aberto", () => {
		render(<NewTaskModal open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

		expect(screen.getByTestId("modal")).toBeInTheDocument();
		expect(screen.getByText("Nova Tarefa")).toBeInTheDocument();
	});

	test("deve exibir campos do formulário", () => {
		render(<NewTaskModal open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

		expect(screen.getByText("Título da Tarefa *")).toBeInTheDocument();
		expect(screen.getByText("Descrição")).toBeInTheDocument();
		expect(screen.getByText("Prioridade")).toBeInTheDocument();
		expect(screen.getByText("Tempo Estimado (min)")).toBeInTheDocument();
		expect(screen.getByText("Subtarefas")).toBeInTheDocument();
	});

	test("deve exibir opções de prioridade", () => {
		render(<NewTaskModal open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

		expect(screen.getByText("Baixa")).toBeInTheDocument();
		expect(screen.getByText("Média")).toBeInTheDocument();
		expect(screen.getByText("Alta")).toBeInTheDocument();
	});

	test("deve validar campos obrigatórios ao submeter vazio", () => {
		render(<NewTaskModal open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

		fireEvent.click(screen.getByText("Criar Tarefa"));

		expect(screen.getByText("Título é obrigatório")).toBeInTheDocument();
		expect(screen.getByText("Descrição é obrigatória")).toBeInTheDocument();
		expect(mockOnSubmit).not.toHaveBeenCalled();
	});

	test("deve submeter quando campos estão preenchidos", () => {
		render(<NewTaskModal open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

		const titleInput = screen.getByPlaceholderText("Ex: Revisar relatório mensal");
		const descInput = screen.getByPlaceholderText("Descreva os detalhes da tarefa...");

		fireEvent.change(titleInput, { target: { value: "Minha tarefa" } });
		fireEvent.change(descInput, { target: { value: "Minha descrição" } });

		fireEvent.click(screen.getByText("Criar Tarefa"));

		expect(mockOnSubmit).toHaveBeenCalledTimes(1);
		expect(mockOnSubmit).toHaveBeenCalledWith(
			expect.objectContaining({
				title: "Minha tarefa",
				description: "Minha descrição",
				priority: "medium",
				status: "todo",
				estimatedMinutes: 30
			})
		);
	});

	test("deve fechar modal após submit", () => {
		render(<NewTaskModal open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

		const titleInput = screen.getByPlaceholderText("Ex: Revisar relatório mensal");
		const descInput = screen.getByPlaceholderText("Descreva os detalhes da tarefa...");

		fireEvent.change(titleInput, { target: { value: "Tarefa" } });
		fireEvent.change(descInput, { target: { value: "Desc" } });
		fireEvent.click(screen.getByText("Criar Tarefa"));

		expect(mockOnClose).toHaveBeenCalledTimes(1);
	});

	test("deve chamar onClose ao cancelar", () => {
		render(<NewTaskModal open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

		fireEvent.click(screen.getByText("Cancelar"));

		expect(mockOnClose).toHaveBeenCalledTimes(1);
	});

	test("deve adicionar subtarefa", () => {
		render(<NewTaskModal open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

		const subtaskInput = screen.getByPlaceholderText("Adicione uma subtarefa...");
		fireEvent.change(subtaskInput, { target: { value: "Minha subtarefa" } });
		fireEvent.click(screen.getByText("+ Adicionar"));

		expect(screen.getByText("Minha subtarefa")).toBeInTheDocument();
	});

	test("não deve adicionar subtarefa vazia", () => {
		render(<NewTaskModal open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

		fireEvent.click(screen.getByText("+ Adicionar"));

		const subtaskItems = screen.queryAllByRole("button", { name: /delete/i });
		expect(subtaskItems.length).toBe(0);
	});

	test("deve incluir subtarefas ao submeter", () => {
		render(<NewTaskModal open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

		const titleInput = screen.getByPlaceholderText("Ex: Revisar relatório mensal");
		const descInput = screen.getByPlaceholderText("Descreva os detalhes da tarefa...");
		const subtaskInput = screen.getByPlaceholderText("Adicione uma subtarefa...");

		fireEvent.change(titleInput, { target: { value: "Tarefa" } });
		fireEvent.change(descInput, { target: { value: "Desc" } });
		fireEvent.change(subtaskInput, { target: { value: "Sub 1" } });
		fireEvent.click(screen.getByText("+ Adicionar"));
		fireEvent.click(screen.getByText("Criar Tarefa"));

		expect(mockOnSubmit).toHaveBeenCalledWith(
			expect.objectContaining({
				subtasks: expect.arrayContaining([
					expect.objectContaining({ title: "Sub 1", completed: false })
				])
			})
		);
	});
});
