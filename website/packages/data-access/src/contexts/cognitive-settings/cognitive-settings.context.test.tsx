import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { CognitiveSettingsProvider, useCognitiveSettings } from "./cognitive-settings.context";

const mockGetSettings = jest.fn().mockResolvedValue({
	complexity: "complete",
	contrast: "normal",
	spacing: 18,
	fontSize: 18,
	alertsEnabled: true,
	alertIntervalMinutes: 30
});
const mockUpdateSettings = jest.fn().mockResolvedValue({});
const mockResetSettings = jest.fn().mockResolvedValue({
	complexity: "complete",
	contrast: "normal",
	spacing: 18,
	fontSize: 18,
	alertsEnabled: true,
	alertIntervalMinutes: 30
});

jest.mock("@repo/data-access", () => ({
	getCognitiveSettings: (...args: any[]) => mockGetSettings(...args),
	updateCognitiveSettings: (...args: any[]) => mockUpdateSettings(...args),
	resetCognitiveSettings: (...args: any[]) => mockResetSettings(...args)
}));

function TestConsumer() {
	const { settings, updateSettings, resetSettings } = useCognitiveSettings();
	return (
		<div>
			<span data-testid="complexity">{settings.complexity}</span>
			<span data-testid="contrast">{settings.contrast}</span>
			<span data-testid="spacing">{settings.spacing}</span>
			<span data-testid="fontSize">{settings.fontSize}</span>
			<span data-testid="alertsEnabled">{String(settings.alertsEnabled)}</span>
			<span data-testid="alertInterval">{settings.alertIntervalMinutes}</span>
			<button onClick={() => updateSettings({ complexity: "simple" })}>set-simple</button>
			<button onClick={() => updateSettings({ contrast: "high" })}>set-high</button>
			<button onClick={() => updateSettings({ spacing: 24 })}>set-spacing-24</button>
			<button onClick={resetSettings}>reset</button>
		</div>
	);
}

function renderWithProvider() {
	return render(
		<CognitiveSettingsProvider>
			<TestConsumer />
		</CognitiveSettingsProvider>
	);
}

describe("CognitiveSettingsContext", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		document.documentElement.removeAttribute("data-contrast");
		document.documentElement.removeAttribute("data-complexity");
	});

	test("deve carregar valores padrão inicialmente", () => {
		renderWithProvider();

		expect(screen.getByTestId("complexity")).toHaveTextContent("complete");
		expect(screen.getByTestId("contrast")).toHaveTextContent("normal");
		expect(screen.getByTestId("spacing")).toHaveTextContent("18");
		expect(screen.getByTestId("fontSize")).toHaveTextContent("18");
		expect(screen.getByTestId("alertsEnabled")).toHaveTextContent("true");
		expect(screen.getByTestId("alertInterval")).toHaveTextContent("30");
	});

	test("deve buscar configurações da API ao montar", async () => {
		mockGetSettings.mockResolvedValue({
			complexity: "simple",
			contrast: "high",
			spacing: 24,
			fontSize: 18,
			alertsEnabled: true,
			alertIntervalMinutes: 30
		});

		renderWithProvider();

		expect(mockGetSettings).toHaveBeenCalledTimes(1);
	});

	test("deve atualizar settings e chamar API", () => {
		renderWithProvider();

		act(() => {
			screen.getByText("set-simple").click();
		});

		expect(screen.getByTestId("complexity")).toHaveTextContent("simple");
		expect(mockUpdateSettings).toHaveBeenCalledWith(
			expect.objectContaining({ complexity: "simple" })
		);
	});

	test("deve resetar para valores padrão e chamar API", () => {
		renderWithProvider();

		act(() => {
			screen.getByText("set-simple").click();
		});

		expect(screen.getByTestId("complexity")).toHaveTextContent("simple");

		act(() => {
			screen.getByText("reset").click();
		});

		expect(screen.getByTestId("complexity")).toHaveTextContent("complete");
		expect(screen.getByTestId("contrast")).toHaveTextContent("normal");
		expect(mockResetSettings).toHaveBeenCalledTimes(1);
	});

	test("deve aplicar CSS custom properties no documento", () => {
		renderWithProvider();

		const root = document.documentElement;
		expect(root.style.getPropertyValue("--space-base")).toBe("18px");
		expect(root.style.getPropertyValue("--font-base")).toBe("18px");
		expect(root.getAttribute("data-contrast")).toBe("normal");
		expect(root.getAttribute("data-complexity")).toBe("complete");
	});

	test("deve atualizar CSS properties ao mudar settings", () => {
		renderWithProvider();

		act(() => {
			screen.getByText("set-spacing-24").click();
		});

		expect(document.documentElement.style.getPropertyValue("--space-base")).toBe("24px");
	});

	test("deve lançar erro se useCognitiveSettings for usado fora do provider", () => {
		const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

		expect(() => {
			render(<TestConsumer />);
		}).toThrow("useCognitiveSettings must be used within a CognitiveSettingsProvider");

		consoleSpy.mockRestore();
	});
});
