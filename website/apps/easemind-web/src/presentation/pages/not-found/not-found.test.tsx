import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NotFoundPage from "./not-found";

jest.mock("@repo/ui", () => ({
	EasemindCard: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="mock-card">{children}</div>
	),
	EasemindDatePicker: () => <div data-testid="mock-datepicker" />,
	EasemindButton: ({ children, onClick, label, ...props }: any) => (
		<button onClick={onClick} {...props}>
			{label || children}
		</button>
	),
	EasemindText: ({ children, ...props }: any) => <span {...props}>{children}</span>,
	EasemindIllustration: (props: any) => <div data-testid="mock-illustration" />
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
	BrowserRouter: ({ children }: { children: React.ReactNode }) => <>{children}</>,
	useNavigate: () => mockNavigate,
	Link: ({ children, to, ...props }: any) => (
		<a href={to} {...props}>
			{children}
		</a>
	)
}));

jest.mock("@repo/data-access", () => ({
	useUser: () => ({ user: null, setUser: jest.fn() })
}));

jest.mock("@repo/utils", () => ({
	useTheme: () => ({
		colors: {
			background: "#ffffff",
			text: "#000000",
			"coral.500": "#ff4353",
			"coral.800": "#666666"
		},
		isDarkMode: false
	})
}));

const renderWithRouter = (component: React.ReactElement) => {
	return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("NotFoundPage", () => {
	it("deve renderizar sem erros", () => {
		renderWithRouter(<NotFoundPage />);
	});

	it('deve exibir título "Página não encontrada!"', () => {
		renderWithRouter(<NotFoundPage />);
		expect(screen.getByText("Página não encontrada!")).toBeInTheDocument();
	});

	it("deve exibir mensagem descritiva", () => {
		renderWithRouter(<NotFoundPage />);
		expect(screen.getByText(/Não encontramos o que você está procurando/i)).toBeInTheDocument();
	});

	it('deve exibir botão "Voltar ao início"', () => {
		renderWithRouter(<NotFoundPage />);
		expect(screen.getByRole("button", { name: /voltar ao início/i })).toBeInTheDocument();
	});

	it("deve exibir ilustração", () => {
		renderWithRouter(<NotFoundPage />);
		expect(screen.getByTestId("mock-illustration")).toBeInTheDocument();
	});

	it("deve renderizar ilustração de not-found", () => {
		renderWithRouter(<NotFoundPage />);
		const illustration = screen.getByTestId("mock-illustration");
		expect(illustration).toBeInTheDocument();
	});
});
