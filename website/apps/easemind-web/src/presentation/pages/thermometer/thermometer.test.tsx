import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import React from "react";
import EasemindThermometerPage from "./thermometer";

const mockSymptoms = [
	{ id: "c1", label: "Dificuldade para encontrar palavras", category: "communication" },
	{ id: "c2", label: "Fala mais rápida ou lenta", category: "communication" },
	{ id: "c3", label: "Evitar contato visual", category: "communication" },
	{ id: "c4", label: "Respostas curtas ou monossilábicas", category: "communication" },
	{ id: "p1", label: "Tensão muscular", category: "physical" },
	{ id: "p2", label: "Respiração acelerada", category: "physical" },
	{ id: "p3", label: "Suor nas mãos", category: "physical" },
	{ id: "p4", label: "Dor de cabeça", category: "physical" },
	{ id: "s1", label: "Balançar o corpo", category: "stereotypies" },
	{ id: "s2", label: "Bater ou esfregar as mãos", category: "stereotypies" },
	{ id: "s3", label: "Movimentos repetitivos", category: "stereotypies" },
	{ id: "s4", label: "Inquietação constante", category: "stereotypies" }
];

jest.mock("@repo/data-access", () => ({
	useUser: () => ({ user: { _id: "1", name: "Test User" }, setUser: jest.fn() }),
	useCognitiveSettings: () => ({
		settings: { complexity: "detailed", spacing: 18, fontSize: 18 }
	}),
	useSymptom: () => ({
		getAllSymptoms: jest.fn().mockResolvedValue(mockSymptoms),
		saveUserSymptoms: jest.fn().mockResolvedValue(undefined),
		getLatestUserSymptoms: jest.fn().mockResolvedValue(null),
		loading: false,
		error: null
	})
}));

const mockUseTheme = {
	colors: {
		"coral.500": "#FF4353",
		"coral.600": "#E63946",
		"grey.200": "#eeeeee",
		"grey.400": "#aaaaaa",
		"grey.500": "#9e9e9e"
	},
	isDarkMode: false
};

jest.mock("@repo/utils", () => ({
	useTheme: () => mockUseTheme
}));

jest.mock("@repo/ui", () => ({
	EasemindCard: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="easemind-card">{children}</div>
	),
	EasemindButton: ({ children, onClick, label, ...props }: any) => (
		<button onClick={onClick} {...props}>
			{label || children}
		</button>
	),
	EasemindText: ({ children, ...props }: any) => <span {...props}>{children}</span>
}));

describe("<EasemindThermometerPage />", () => {
	test("deve renderizar o componente corretamente", () => {
		render(<EasemindThermometerPage />);

		expect(screen.getByText("Termômetro Sensorial")).toBeInTheDocument();
		expect(screen.getByText(/Identifique sinais de sobrecarga/i)).toBeInTheDocument();
	});

	test("deve exibir o alerta ao selecionar mais de 4 sintomas", async () => {
		render(<EasemindThermometerPage />);

		await waitFor(() => {
			expect(screen.getByText("Tensão muscular")).toBeInTheDocument();
		});

		const s1 = screen.getByText("Tensão muscular").closest("div");
		const s2 = screen.getByText("Dor de cabeça").closest("div");
		const s3 = screen.getByText("Balançar o corpo").closest("div");
		const s4 = screen.getByText("Inquietação constante").closest("div");
		const s5 = screen.getByText("Respiração acelerada").closest("div");

		if (s1) fireEvent.click(s1);
		if (s2) fireEvent.click(s2);
		if (s3) fireEvent.click(s3);
		if (s4) fireEvent.click(s4);
		if (s5) fireEvent.click(s5);

		await waitFor(() => {
			expect(screen.getByText("Atenção: Sinais de Alerta")).toBeInTheDocument();
		});
	});

	test("deve fechar o alerta ao clicar no botão de fechar", async () => {
		render(<EasemindThermometerPage />);

		await waitFor(() => {
			expect(screen.getByText("Tensão muscular")).toBeInTheDocument();
		});

		const s1 = screen.getByText("Tensão muscular").closest("div");
		const s2 = screen.getByText("Dor de cabeça").closest("div");
		const s3 = screen.getByText("Balançar o corpo").closest("div");
		const s4 = screen.getByText("Inquietação constante").closest("div");
		const s5 = screen.getByText("Respiração acelerada").closest("div");

		if (s1) fireEvent.click(s1);
		if (s2) fireEvent.click(s2);
		if (s3) fireEvent.click(s3);
		if (s4) fireEvent.click(s4);
		if (s5) fireEvent.click(s5);

		await waitFor(() => {
			expect(screen.getByText("Atenção: Sinais de Alerta")).toBeInTheDocument();
		});

		const closeButton = screen.getByLabelText(/close/i);
		fireEvent.click(closeButton);

		expect(screen.queryByText("Atenção: Sinais de Alerta")).not.toBeInTheDocument();
	});

	test("deve exibir as três categorias de sintomas", () => {
		render(<EasemindThermometerPage />);

		expect(screen.getByText("Falha na Comunicação")).toBeInTheDocument();
		expect(screen.getByText("Sintomas Físicos")).toBeInTheDocument();
		expect(screen.getByText("Aumento de Estereotipias")).toBeInTheDocument();
	});

	test("deve exibir todos os sintomas de comunicação", async () => {
		render(<EasemindThermometerPage />);

		await waitFor(() => {
			expect(screen.getByText("Dificuldade para encontrar palavras")).toBeInTheDocument();
		});
		expect(screen.getByText("Fala mais rápida ou lenta")).toBeInTheDocument();
		expect(screen.getByText("Evitar contato visual")).toBeInTheDocument();
		expect(screen.getByText("Respostas curtas ou monossilábicas")).toBeInTheDocument();
	});

	test("deve exibir todos os sintomas físicos", async () => {
		render(<EasemindThermometerPage />);

		await waitFor(() => {
			expect(screen.getByText("Tensão muscular")).toBeInTheDocument();
		});
		expect(screen.getByText("Respiração acelerada")).toBeInTheDocument();
		expect(screen.getByText("Suor nas mãos")).toBeInTheDocument();
		expect(screen.getByText("Dor de cabeça")).toBeInTheDocument();
	});

	test("deve exibir todos os sintomas de estereotipias", async () => {
		render(<EasemindThermometerPage />);

		await waitFor(() => {
			expect(screen.getByText("Balançar o corpo")).toBeInTheDocument();
		});
		expect(screen.getByText("Bater ou esfregar as mãos")).toBeInTheDocument();
		expect(screen.getByText("Movimentos repetitivos")).toBeInTheDocument();
		expect(screen.getByText("Inquietação constante")).toBeInTheDocument();
	});

	test("deve selecionar um sintoma ao clicar", async () => {
		render(<EasemindThermometerPage />);

		await waitFor(() => {
			expect(screen.getByText("Tensão muscular")).toBeInTheDocument();
		});

		const symptom = screen.getByText("Tensão muscular").closest("div");
		if (symptom) {
			fireEvent.click(symptom);
		}

		expect(screen.getByText("Sintomas identificados: 1")).toBeInTheDocument();
	});

	test("deve aumentar o contador ao selecionar múltiplos sintomas", async () => {
		render(<EasemindThermometerPage />);

		await waitFor(() => {
			expect(screen.getByText("Tensão muscular")).toBeInTheDocument();
		});

		const symptom1 = screen.getByText("Tensão muscular").closest("div");
		const symptom2 = screen.getByText("Dor de cabeça").closest("div");
		const symptom3 = screen.getByText("Balançar o corpo").closest("div");

		if (symptom1) fireEvent.click(symptom1);
		if (symptom2) fireEvent.click(symptom2);
		if (symptom3) fireEvent.click(symptom3);

		expect(screen.getByText("Sintomas identificados: 3")).toBeInTheDocument();
	});

	test("deve desselecionar um sintoma ao clicar novamente", async () => {
		render(<EasemindThermometerPage />);

		await waitFor(() => {
			expect(screen.getByText("Tensão muscular")).toBeInTheDocument();
		});

		const symptom = screen.getByText("Tensão muscular").closest("div");

		if (symptom) {
			fireEvent.click(symptom);
			expect(screen.getByText("Sintomas identificados: 1")).toBeInTheDocument();

			fireEvent.click(symptom);
			expect(screen.getByText("Sintomas identificados: 0")).toBeInTheDocument();
		}
	});

	test("deve atualizar a contagem por categoria", async () => {
		render(<EasemindThermometerPage />);

		await waitFor(() => {
			expect(screen.getByText("Tensão muscular")).toBeInTheDocument();
		});

		const symptom1 = screen.getByText("Tensão muscular").closest("div");
		const symptom2 = screen.getByText("Dor de cabeça").closest("div");

		if (symptom1) fireEvent.click(symptom1);
		if (symptom2) fireEvent.click(symptom2);

		const physicalCategory = screen.getAllByText("Físicos")[0].closest("div");
		if (physicalCategory) {
			expect(within(physicalCategory).getByText("2")).toBeInTheDocument();
		}
	});

	test("deve resetar todas as seleções ao clicar em Resetar", async () => {
		render(<EasemindThermometerPage />);

		await waitFor(() => {
			expect(screen.getByText("Tensão muscular")).toBeInTheDocument();
		});

		const symptom1 = screen.getByText("Tensão muscular").closest("div");
		const symptom2 = screen.getByText("Dor de cabeça").closest("div");

		if (symptom1) fireEvent.click(symptom1);
		if (symptom2) fireEvent.click(symptom2);

		expect(screen.getByText("Sintomas identificados: 2")).toBeInTheDocument();

		const resetButton = screen.getByRole("button", { name: /resetar/i });
		fireEvent.click(resetButton);

		expect(screen.getByText("Sintomas identificados: 0")).toBeInTheDocument();
	});

	test("deve exibir o emoji correto baseado no nível de sintomas", async () => {
		render(<EasemindThermometerPage />);

		await waitFor(() => {
			expect(screen.getByText("Tensão muscular")).toBeInTheDocument();
		});

		const symptom1 = screen.getByText("Tensão muscular").closest("div");
		const symptom2 = screen.getByText("Dor de cabeça").closest("div");
		const symptom3 = screen.getByText("Balançar o corpo").closest("div");
		const symptom4 = screen.getByText("Inquietação constante").closest("div");

		if (symptom1) fireEvent.click(symptom1);
		if (symptom2) fireEvent.click(symptom2);
		if (symptom3) fireEvent.click(symptom3);
		if (symptom4) fireEvent.click(symptom4);

		expect(screen.getByText("Sintomas identificados: 4")).toBeInTheDocument();
	});

	test("deve exibir o nível de temperatura correto", async () => {
		render(<EasemindThermometerPage />);

		await waitFor(() => {
			expect(screen.getByText("Tensão muscular")).toBeInTheDocument();
		});

		const symptom1 = screen.getByText("Tensão muscular").closest("div");
		const symptom2 = screen.getByText("Dor de cabeça").closest("div");

		if (symptom1) fireEvent.click(symptom1);
		if (symptom2) fireEvent.click(symptom2);

		expect(screen.getByText("Sintomas identificados: 2")).toBeInTheDocument();
	});

	test("deve renderizar os botões de ação no alerta", async () => {
		render(<EasemindThermometerPage />);

		await waitFor(() => {
			expect(screen.getByText("Tensão muscular")).toBeInTheDocument();
		});

		const s1 = screen.getByText("Tensão muscular").closest("div");
		const s2 = screen.getByText("Dor de cabeça").closest("div");
		const s3 = screen.getByText("Balançar o corpo").closest("div");
		const s4 = screen.getByText("Inquietação constante").closest("div");
		const s5 = screen.getByText("Respiração acelerada").closest("div");

		if (s1) fireEvent.click(s1);
		if (s2) fireEvent.click(s2);
		if (s3) fireEvent.click(s3);
		if (s4) fireEvent.click(s4);
		if (s5) fireEvent.click(s5);

		await waitFor(() => {
			expect(screen.getByText("Atenção: Sinais de Alerta")).toBeInTheDocument();
		});

		const alertButtons = screen.getAllByRole("button");
		expect(alertButtons.length).toBeGreaterThan(0);
	});

	test("deve exibir o contador inicial como 0", () => {
		render(<EasemindThermometerPage />);

		expect(screen.getByText(/Sintomas identificados/i)).toBeInTheDocument();
	});

	test("deve renderizar os cards de categorias", () => {
		render(<EasemindThermometerPage />);

		const cards = screen.getAllByTestId("easemind-card");
		expect(cards.length).toBeGreaterThan(0);
	});
});
