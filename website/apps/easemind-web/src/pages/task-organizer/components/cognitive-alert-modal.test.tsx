import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { CognitiveAlertModal } from "./cognitive-alert-modal";

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
		title
	}: {
		children: React.ReactNode;
		open: boolean;
		title: string;
	}) =>
		open ? (
			<div data-testid="alert-modal">
				<span>{title}</span>
				{children}
			</div>
		) : null
}));

describe("<CognitiveAlertModal />", () => {
	const defaultProps = {
		open: true,
		onContinue: jest.fn(),
		onStop: jest.fn(),
		isDarkMode: false,
		textSecondary: "#666",
		minutes: 30
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("deve renderizar quando aberto", () => {
		render(<CognitiveAlertModal {...defaultProps} />);

		expect(screen.getByTestId("alert-modal")).toBeInTheDocument();
		expect(screen.getByText("Alerta Cognitivo")).toBeInTheDocument();
	});

	test("não deve renderizar quando fechado", () => {
		render(<CognitiveAlertModal {...defaultProps} open={false} />);

		expect(screen.queryByTestId("alert-modal")).not.toBeInTheDocument();
	});

	test("deve exibir mensagem com minutos corretos", () => {
		render(<CognitiveAlertModal {...defaultProps} minutes={45} />);

		expect(screen.getByText("Você está focado há 45 minutos")).toBeInTheDocument();
	});

	test("deve exibir texto de orientação", () => {
		render(<CognitiveAlertModal {...defaultProps} />);

		expect(screen.getByText(/Considere fazer uma pausa curta/)).toBeInTheDocument();
	});

	test("deve chamar onContinue ao clicar em 'Continuar foco'", () => {
		render(<CognitiveAlertModal {...defaultProps} />);

		fireEvent.click(screen.getByText("Continuar foco"));

		expect(defaultProps.onContinue).toHaveBeenCalledTimes(1);
	});

	test("deve chamar onStop ao clicar em 'Encerrar foco'", () => {
		render(<CognitiveAlertModal {...defaultProps} />);

		fireEvent.click(screen.getByText("Encerrar foco"));

		expect(defaultProps.onStop).toHaveBeenCalledTimes(1);
	});
});
