import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { SectionCard } from "./section-card";

describe("<SectionCard />", () => {
	const defaultProps = {
		icon: <span data-testid="section-icon">Icon</span>,
		title: "Nível de Complexidade",
		subtitle: "Ajuste a quantidade de informações",
		cardBg: "#fff",
		iconBg: "#ffedd4",
		borderSubtle: "transparent",
		textPrimary: "#111",
		textSecondary: "#666"
	};

	test("deve renderizar título", () => {
		render(
			<SectionCard {...defaultProps}>
				<div>Content</div>
			</SectionCard>
		);

		expect(screen.getByText("Nível de Complexidade")).toBeInTheDocument();
	});

	test("deve renderizar subtítulo", () => {
		render(
			<SectionCard {...defaultProps}>
				<div>Content</div>
			</SectionCard>
		);

		expect(screen.getByText("Ajuste a quantidade de informações")).toBeInTheDocument();
	});

	test("deve renderizar ícone", () => {
		render(
			<SectionCard {...defaultProps}>
				<div>Content</div>
			</SectionCard>
		);

		expect(screen.getByTestId("section-icon")).toBeInTheDocument();
	});

	test("deve renderizar children", () => {
		render(
			<SectionCard {...defaultProps}>
				<span>Meu conteúdo</span>
			</SectionCard>
		);

		expect(screen.getByText("Meu conteúdo")).toBeInTheDocument();
	});

	test("deve aplicar classe cog-section-card", () => {
		const { container } = render(
			<SectionCard {...defaultProps}>
				<div>Content</div>
			</SectionCard>
		);

		expect(container.querySelector(".cog-section-card")).toBeInTheDocument();
	});
});
