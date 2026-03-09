import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { OptionCard } from "./option-card";

describe("<OptionCard />", () => {
	const defaultProps = {
		selected: false,
		onClick: jest.fn(),
		icon: <span data-testid="icon">Icon</span>,
		label: "Simples",
		description: "Apenas o essencial",
		optionBorder: "#e5e7eb",
		selectedBg: "#fef2f2",
		accentColor: "#ff4353",
		iconRingBg: "#dcfce7",
		textPrimary: "#111",
		textSecondary: "#666"
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("deve renderizar label e descrição", () => {
		render(<OptionCard {...defaultProps} />);

		expect(screen.getByText("Simples")).toBeInTheDocument();
		expect(screen.getByText("Apenas o essencial")).toBeInTheDocument();
	});

	test("deve renderizar ícone", () => {
		render(<OptionCard {...defaultProps} />);

		expect(screen.getByTestId("icon")).toBeInTheDocument();
	});

	test("deve chamar onClick ao clicar", () => {
		render(<OptionCard {...defaultProps} />);

		fireEvent.click(screen.getByText("Simples"));

		expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
	});

	test("deve chamar onClick ao pressionar Enter", () => {
		render(<OptionCard {...defaultProps} />);

		fireEvent.keyDown(screen.getByRole("button"), { key: "Enter" });

		expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
	});

	test("deve ter role button", () => {
		render(<OptionCard {...defaultProps} />);

		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	test("deve aplicar classe selected quando selecionado", () => {
		const { container } = render(<OptionCard {...defaultProps} selected={true} />);

		const card = container.querySelector(".cog-option-card--selected");
		expect(card).toBeInTheDocument();
	});

	test("não deve ter classe selected quando não selecionado", () => {
		const { container } = render(<OptionCard {...defaultProps} selected={false} />);

		const card = container.querySelector(".cog-option-card--selected");
		expect(card).not.toBeInTheDocument();
	});
});
