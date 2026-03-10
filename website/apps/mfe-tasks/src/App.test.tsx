import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";

jest.mock("@repo/data-access", () => ({
	useCognitiveSettings: () => ({
		settings: {
			complexity: "complete",
			contrast: "normal",
			spacing: 18,
			fontSize: 18,
			alertsEnabled: true,
			alertIntervalMinutes: 30
		}
	}),
	CognitiveSettingsProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

jest.mock("@repo/utils", () => ({
	useTheme: () => ({
		colors: {
			background: "#1a1a2e",
			"background.card": "#16213e",
			"coral.500": "#FF4353",
			"coral.600": "#E63946",
			"coral.800": "#aaa",
			"coral.400": "#ff8888",
			"coral.contrast": "#ffffff"
		},
		isDarkMode: false
	}),
	EasemindThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

jest.mock("@repo/ui", () => ({
	EasemindButton: ({ label, onClick }: any) => <button onClick={onClick}>{label}</button>,
	EasemindSnackbar: () => null
}));

jest.mock("./pages/task-organizer/task-organizer", () => {
	return function MockTaskOrganizerPage() {
		return <div data-testid="task-organizer">Task Organizer</div>;
	};
});

import App from "./App";

test("renders app without crashing", () => {
	render(<App />);
	expect(screen.getByTestId("task-organizer")).toBeInTheDocument();
});
