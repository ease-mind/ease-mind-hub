import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import CognitiveSettingsPage from "./cognitive-settings";

const mockSettings = {
	complexity: "complete" as const,
	contrast: "normal" as const,
	spacing: 18 as const,
	fontSize: 18 as const,
	alertsEnabled: true,
	alertIntervalMinutes: 30
};

const mockUpdateSettings = jest.fn();
const mockResetSettings = jest.fn();

jest.mock("../../contexts/cognitive-settings/cognitive-settings.context", () => ({
	...jest.requireActual("../../contexts/cognitive-settings/cognitive-settings.context"),
	useCognitiveSettings: () => ({
		settings: mockSettings,
		updateSettings: mockUpdateSettings,
		resetSettings: mockResetSettings
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
			"coral.contrast": "#ffffff"
		},
		isDarkMode: false
	})
}));

jest.mock("@repo/ui", () => ({
	EaseMindButton: ({ label, onClick }: { label: string; onClick?: () => void }) => (
		<button onClick={onClick}>{label}</button>
	),
	EaseMindSnackbar: () => null
}));

describe("<CognitiveSettingsPage />", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("deve renderizar título e descrição", () => {
		render(<CognitiveSettingsPage />);

		expect(screen.getByText("Configurações Cognitivas")).toBeInTheDocument();
		expect(
			screen.getByText("Personalize sua experiência para melhor suporte cognitivo")
		).toBeInTheDocument();
	});

	test("deve exibir todas as seções no modo completo", () => {
		render(<CognitiveSettingsPage />);

		expect(screen.getByText("Nível de Complexidade da Interface")).toBeInTheDocument();
		expect(screen.getByText("Contraste")).toBeInTheDocument();
		expect(screen.getByText("Espaçamento")).toBeInTheDocument();
		expect(screen.getByText("Tamanho da Fonte")).toBeInTheDocument();
		expect(screen.getByText("Alertas Cognitivos")).toBeInTheDocument();
	});

	test("deve exibir opções de complexidade", () => {
		render(<CognitiveSettingsPage />);

		expect(screen.getByText("Simples")).toBeInTheDocument();
		expect(screen.getByText("Completo")).toBeInTheDocument();
	});

	test("deve exibir opções de contraste", () => {
		render(<CognitiveSettingsPage />);

		expect(screen.getByText("Baixo")).toBeInTheDocument();
		expect(screen.getByText("Normal")).toBeInTheDocument();
		expect(screen.getByText("Alto")).toBeInTheDocument();
	});

	test("deve exibir botões de salvar e cancelar", () => {
		render(<CognitiveSettingsPage />);

		expect(screen.getByText("Salvar Configurações")).toBeInTheDocument();
		expect(screen.getByText("Cancelar")).toBeInTheDocument();
	});

	test("deve chamar updateSettings ao clicar em Salvar", () => {
		render(<CognitiveSettingsPage />);

		fireEvent.click(screen.getByText("Salvar Configurações"));

		expect(mockUpdateSettings).toHaveBeenCalledTimes(1);
	});

	test("não deve aplicar alterações antes de salvar", () => {
		render(<CognitiveSettingsPage />);

		fireEvent.click(screen.getByText("Simples"));

		expect(mockUpdateSettings).not.toHaveBeenCalled();
	});

	test("deve aplicar alterações somente ao salvar", () => {
		render(<CognitiveSettingsPage />);

		fireEvent.click(screen.getByText("Simples"));

		fireEvent.click(screen.getByText("Salvar Configurações"));

		expect(mockUpdateSettings).toHaveBeenCalledTimes(1);
		expect(mockUpdateSettings).toHaveBeenCalledWith(
			expect.objectContaining({ complexity: "simple" })
		);
	});

	test("deve exibir valor do espaçamento", () => {
		render(<CognitiveSettingsPage />);

		expect(screen.getByText(/Espaçamento: 18px/)).toBeInTheDocument();
	});

	test("deve exibir valor do tamanho da fonte", () => {
		render(<CognitiveSettingsPage />);

		expect(screen.getByText(/Tamanho: 18px/)).toBeInTheDocument();
	});

	test("deve exibir toggle de alertas", () => {
		render(<CognitiveSettingsPage />);

		expect(screen.getByText("Alertas Ativados")).toBeInTheDocument();
	});

	test("deve exibir intervalo de alertas", () => {
		render(<CognitiveSettingsPage />);

		expect(screen.getByText(/Alerta após 30 minutos/)).toBeInTheDocument();
	});

	test("deve exibir preview de fonte", () => {
		render(<CognitiveSettingsPage />);

		expect(
			screen.getByText("Parágrafo de exemplo com o tamanho selecionado.")
		).toBeInTheDocument();
	});

	test("a descrição não deve ter capitalize indevido", () => {
		render(<CognitiveSettingsPage />);

		const desc = screen.getByText("Personalize sua experiência para melhor suporte cognitivo");
		const style = window.getComputedStyle(desc);
		expect(style.textTransform).not.toBe("capitalize");
	});
});
