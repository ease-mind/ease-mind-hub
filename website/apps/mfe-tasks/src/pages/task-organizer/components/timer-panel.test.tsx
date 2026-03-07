import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { TimerPanel } from "./timer-panel";

jest.mock("@repo/ui", () => ({
	EasemindButton: ({
		label,
		onClick
	}: {
		label: string;
		onClick?: () => void;
		[key: string]: any;
	}) => <button onClick={onClick}>{label}</button>
}));

describe("<TimerPanel />", () => {
	const mockTimer = {
		state: "idle" as const,
		display: "25:00",
		remaining: 1500,
		totalSeconds: 1500,
		progress: 0,
		minutes: 25,
		seconds: 0,
		start: jest.fn(),
		pause: jest.fn(),
		resume: jest.fn(),
		reset: jest.fn(),
		setMinutes: jest.fn()
	};

	const defaultProps = {
		timer: mockTimer,
		isDarkMode: false,
		cardBg: "#fff",
		textPrimary: "#111",
		textSecondary: "#666"
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("deve renderizar título do timer", () => {
		render(<TimerPanel {...defaultProps} />);

		expect(screen.getByText("Tempo de foco")).toBeInTheDocument();
	});

	test("deve exibir o display do timer", () => {
		render(<TimerPanel {...defaultProps} />);

		expect(screen.getByText("25:00")).toBeInTheDocument();
	});

	test("deve exibir presets de tempo", () => {
		render(<TimerPanel {...defaultProps} />);

		expect(screen.getByText("15min")).toBeInTheDocument();
		expect(screen.getByText("25min")).toBeInTheDocument();
		expect(screen.getByText("45min")).toBeInTheDocument();
	});

	test("deve exibir botão Iniciar quando idle", () => {
		render(<TimerPanel {...defaultProps} />);

		expect(screen.getByText("Iniciar")).toBeInTheDocument();
	});

	test("deve chamar start ao clicar em Iniciar", () => {
		render(<TimerPanel {...defaultProps} />);

		fireEvent.click(screen.getByText("Iniciar"));

		expect(mockTimer.start).toHaveBeenCalledTimes(1);
	});

	test("deve exibir botão Pausar quando running", () => {
		const runningTimer = { ...mockTimer, state: "running" as const };
		render(<TimerPanel {...defaultProps} timer={runningTimer} />);

		expect(screen.getByText("Pausar")).toBeInTheDocument();
	});

	test("deve chamar pause ao clicar em Pausar", () => {
		const runningTimer = { ...mockTimer, state: "running" as const };
		render(<TimerPanel {...defaultProps} timer={runningTimer} />);

		fireEvent.click(screen.getByText("Pausar"));

		expect(mockTimer.pause).toHaveBeenCalledTimes(1);
	});

	test("deve exibir botão Retomar quando pausado", () => {
		const pausedTimer = { ...mockTimer, state: "paused" as const };
		render(<TimerPanel {...defaultProps} timer={pausedTimer} />);

		expect(screen.getByText("Retomar")).toBeInTheDocument();
	});

	test("deve chamar setMinutes ao clicar em preset", () => {
		render(<TimerPanel {...defaultProps} />);

		fireEvent.click(screen.getByText("15min"));

		expect(mockTimer.setMinutes).toHaveBeenCalledWith(15);
	});

	test("deve exibir status Pronto quando idle", () => {
		render(<TimerPanel {...defaultProps} />);

		expect(screen.getByText("Pronto")).toBeInTheDocument();
	});

	test("deve exibir status Focando quando running", () => {
		const runningTimer = { ...mockTimer, state: "running" as const };
		render(<TimerPanel {...defaultProps} timer={runningTimer} />);

		expect(screen.getByText("Focando...")).toBeInTheDocument();
	});

	test("deve exibir status Pausado quando paused", () => {
		const pausedTimer = { ...mockTimer, state: "paused" as const };
		render(<TimerPanel {...defaultProps} timer={pausedTimer} />);

		expect(screen.getByText("Pausado")).toBeInTheDocument();
	});
});
