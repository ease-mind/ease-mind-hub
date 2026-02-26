import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { StatisticsPanel } from "./statistics-panel";

describe("<StatisticsPanel />", () => {
	const defaultProps = {
		totalTasks: 10,
		completedCount: 4,
		inProgressCount: 3,
		progressPercent: 40,
		isDarkMode: false,
		cardBg: "#fff",
		textPrimary: "#111",
		textSecondary: "#666"
	};

	test("deve renderizar título Estatísticas", () => {
		render(<StatisticsPanel {...defaultProps} />);

		expect(screen.getByText("Estatísticas")).toBeInTheDocument();
	});

	test("deve exibir total de tarefas", () => {
		render(<StatisticsPanel {...defaultProps} />);

		expect(screen.getByText("10")).toBeInTheDocument();
		expect(screen.getByText("Tarefas Hoje")).toBeInTheDocument();
	});

	test("deve exibir tarefas concluídas", () => {
		render(<StatisticsPanel {...defaultProps} />);

		expect(screen.getByText("4")).toBeInTheDocument();
		expect(screen.getByText("Concluídas")).toBeInTheDocument();
	});

	test("deve exibir tarefas em progresso", () => {
		render(<StatisticsPanel {...defaultProps} />);

		expect(screen.getByText("3")).toBeInTheDocument();
		expect(screen.getByText("Em Progresso")).toBeInTheDocument();
	});

	test("deve exibir porcentagem de produtividade", () => {
		render(<StatisticsPanel {...defaultProps} />);

		expect(screen.getByText("40%")).toBeInTheDocument();
		expect(screen.getByText("Produtividade")).toBeInTheDocument();
	});
});
