import { Lightbulb } from "@mui/icons-material";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { TipDef } from "../types";
import { TipsPanel } from "./tips-panel";

const mockTips: TipDef[] = [
	{
		icon: <Lightbulb />,
		title: "Dica 1",
		description: "Descrição da dica 1",
		iconColor: "#ff0",
		iconBg: "#ffe"
	},
	{
		icon: <Lightbulb />,
		title: "Dica 2",
		description: "Descrição da dica 2",
		iconColor: "#0f0",
		iconBg: "#efe"
	}
];

describe("<TipsPanel />", () => {
	const defaultProps = {
		tips: mockTips,
		title: "Dicas de Teste",
		isDarkMode: false,
		cardBg: "#fff",
		textPrimary: "#111",
		textSecondary: "#666"
	};

	test("deve renderizar título do painel", () => {
		render(<TipsPanel {...defaultProps} />);

		expect(screen.getByText("Dicas de Teste")).toBeInTheDocument();
	});

	test("deve renderizar todas as dicas", () => {
		render(<TipsPanel {...defaultProps} />);

		expect(screen.getByText("Dica 1")).toBeInTheDocument();
		expect(screen.getByText("Dica 2")).toBeInTheDocument();
	});

	test("deve renderizar descrições das dicas", () => {
		render(<TipsPanel {...defaultProps} />);

		expect(screen.getByText("Descrição da dica 1")).toBeInTheDocument();
		expect(screen.getByText("Descrição da dica 2")).toBeInTheDocument();
	});

	test("deve renderizar com título customizado", () => {
		render(<TipsPanel {...defaultProps} title="Dicas de Foco" />);

		expect(screen.getByText("Dicas de Foco")).toBeInTheDocument();
	});
});
