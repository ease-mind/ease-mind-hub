import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode
} from "react";

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

const STORAGE_KEY = "easemind:cognitiveSettings:v1";

export const DEFAULT_SETTINGS: CognitiveSettings = {
	complexity: "complete",
	contrast: "normal",
	spacing: 18,
	fontSize: 18,
	alertsEnabled: true,
	alertIntervalMinutes: 30
};

function loadSettings(): CognitiveSettings {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) {
			return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
		}
	} catch {}
	return { ...DEFAULT_SETTINGS };
}

function persistSettings(settings: CognitiveSettings): void {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

const CognitiveSettingsContext = createContext<CognitiveSettingsContextProps | undefined>(
	undefined
);

export function CognitiveSettingsProvider({ children }: { children: ReactNode }) {
	const [settings, setSettings] = useState<CognitiveSettings>(loadSettings);

	const updateSettings = useCallback((patch: Partial<CognitiveSettings>) => {
		setSettings(prev => {
			const next = { ...prev, ...patch };
			persistSettings(next);
			return next;
		});
	}, []);

	const resetSettings = useCallback(() => {
		setSettings({ ...DEFAULT_SETTINGS });
		persistSettings(DEFAULT_SETTINGS);
	}, []);

	useEffect(() => {
		const root = document.documentElement;
		root.style.setProperty("--space-base", `${settings.spacing}px`);
		root.style.setProperty("--font-base", `${settings.fontSize}px`);
		root.setAttribute("data-contrast", settings.contrast);
		root.setAttribute("data-complexity", settings.complexity);
	}, [settings.spacing, settings.fontSize, settings.contrast, settings.complexity]);

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
