import { render } from "@testing-library/react";
import React from "react";
import App from "./App";

jest.mock("react-router-dom", () => ({
	BrowserRouter: ({ children }: { children: React.ReactNode }) => <>{children}</>,
	Routes: ({ children }: { children: React.ReactNode }) => <>{children}</>,
	Route: () => null,
	useNavigate: () => jest.fn(),
	useLocation: () => ({ pathname: "/" }),
	Navigate: () => null
}));

jest.mock("@repo/data-access", () => ({
	useUser: () => ({ user: null, isAuthenticated: false, setUser: jest.fn() }),
	AuthRepository: jest.fn()
}));

jest.mock("@repo/ui", () => ({
	EasemindCard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
	EasemindButton: ({ children, label }: any) => <button>{label || children}</button>,
	EasemindText: ({ children }: any) => <span>{children}</span>,
	EasemindIllustration: () => <div />,
	EasemindInputController: () => <input />,
	EasemindSnackbar: () => null,
	EasemindSelectController: () => <select />,
	EasemindModal: () => null,
	SnackbarData: {},
	AccessModalType: { LOGIN: "LOGIN", REGISTER: "REGISTER" }
}));

jest.mock("@repo/utils", () => ({
	useTheme: () => ({
		colors: { background: "#ffffff", text: "#000000", "coral.500": "#ff4353" },
		isDarkMode: false
	}),
	formatCPF: (v: string) => v,
	validateCPF: () => true
}));

test("deve montar o App sem crash", () => {
	render(<App />);
});
