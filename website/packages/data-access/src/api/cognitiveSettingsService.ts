import { api } from "../helpers/api";

export interface CognitiveSettingsData {
	complexity: "simple" | "complete";
	contrast: "low" | "normal" | "high";
	spacing: 12 | 18 | 24;
	fontSize: 12 | 18 | 24;
	alertsEnabled: boolean;
	alertIntervalMinutes: number;
}

export async function getCognitiveSettings(): Promise<CognitiveSettingsData> {
	const { data } = await api.get<CognitiveSettingsData>("/cognitive-settings");
	return data;
}

export async function updateCognitiveSettings(
	settings: Partial<CognitiveSettingsData>
): Promise<CognitiveSettingsData> {
	const { data } = await api.put<CognitiveSettingsData>("/cognitive-settings", settings);
	return data;
}

export async function resetCognitiveSettings(): Promise<CognitiveSettingsData> {
	const { data } = await api.post<CognitiveSettingsData>("/cognitive-settings/reset");
	return data;
}
