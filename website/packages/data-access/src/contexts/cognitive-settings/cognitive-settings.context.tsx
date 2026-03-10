import { useTheme } from "@repo/utils";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode
} from "react";
import {
	getCognitiveSettings as fetchSettings,
	resetCognitiveSettings as resetRemoteSettings,
	updateCognitiveSettings as saveSettings
} from "../../api/cognitiveSettingsService";

export type ComplexityLevel = "simple" | "complete";
export type ContrastLevel = "low" | "normal" | "high";
export type SpacingValue = 12 | 18 | 24;
export type FontSizeValue = 12 | 18 | 24;

export interface CognitiveSettings {
	complexity: ComplexityLevel;
	contrast: ContrastLevel;
	spacing: SpacingValue;
	fontSize: FontSizeValue;
	alertsEnabled: boolean;
	alertIntervalMinutes: number;
}

export interface CognitiveSettingsContextProps {
	settings: CognitiveSettings;
	updateSettings: (patch: Partial<CognitiveSettings>) => void;
	resetSettings: () => void;
}

export const DEFAULT_SETTINGS: CognitiveSettings = {
	complexity: "complete",
	contrast: "normal",
	spacing: 18,
	fontSize: 18,
	alertsEnabled: true,
	alertIntervalMinutes: 30
};

const CognitiveSettingsContext = createContext<CognitiveSettingsContextProps | undefined>(
	undefined
);

export function CognitiveSettingsProvider({ children }: { children: ReactNode }) {
	const [settings, setSettings] = useState<CognitiveSettings>({ ...DEFAULT_SETTINGS });
	const { isDarkMode } = useTheme();

	useEffect(() => {
		const token = sessionStorage.getItem("token");
		if (!token) return;
		fetchSettings()
			.then(data => setSettings(prev => ({ ...prev, ...data })))
			.catch(() => {});
	}, []);

	const updateSettings = useCallback((patch: Partial<CognitiveSettings>) => {
		setSettings(prev => {
			const next = { ...prev, ...patch };
			saveSettings(next).catch(() => {});
			return next;
		});
	}, []);

	const resetSettings = useCallback(() => {
		setSettings({ ...DEFAULT_SETTINGS });
		resetRemoteSettings().catch(() => {});
	}, []);

	useEffect(() => {
		const root = document.documentElement;
		const body = document.body;

		if (isDarkMode) {
			root.classList.add("dark-mode");
			body.classList.add("dark-mode");
		} else {
			root.classList.remove("dark-mode");
			body.classList.remove("dark-mode");
		}

		root.style.setProperty("--space-base", `${settings.spacing}px`);
		root.style.setProperty("--font-size-base", `${settings.fontSize}px`);
		root.style.setProperty("--font-base", `${settings.fontSize}px`);

		root.setAttribute("data-contrast", settings.contrast);
		root.setAttribute("data-complexity", settings.complexity);
		body.setAttribute("data-contrast", settings.contrast);
		body.setAttribute("data-complexity", settings.complexity);
	}, [settings.spacing, settings.fontSize, settings.contrast, settings.complexity, isDarkMode]);

	const value = useMemo(
		() => ({ settings, updateSettings, resetSettings }),
		[settings, updateSettings, resetSettings]
	);

	return (
		<CognitiveSettingsContext.Provider value={value}>
			{children}
		</CognitiveSettingsContext.Provider>
	);
}

export function useCognitiveSettings(): CognitiveSettingsContextProps {
	const ctx = useContext(CognitiveSettingsContext);
	if (!ctx) {
		throw new Error("useCognitiveSettings must be used within a CognitiveSettingsProvider");
	}
	return ctx;
}
