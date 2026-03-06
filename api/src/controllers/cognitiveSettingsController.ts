import { Request, Response } from "express";
import CognitiveSettings from "../models/cognitiveSettingsModel";

const DEFAULT_SETTINGS = {
	complexity: "complete" as const,
	contrast: "normal" as const,
	spacing: 12 as const,
	fontSize: 16 as const,
	alertsEnabled: true,
	alertIntervalMinutes: 30
};

function toSettingsResponse(doc: any) {
	return {
		complexity: doc.complexity,
		contrast: doc.contrast,
		spacing: doc.spacing,
		fontSize: doc.fontSize,
		alertsEnabled: doc.alertsEnabled,
		alertIntervalMinutes: doc.alertIntervalMinutes
	};
}

export const getCognitiveSettings = async (req: Request, res: Response): Promise<any> => {
	try {
		const userId = req.userId;
		if (!userId) {
			return res.status(401).json({ message: "Usuário não autenticado" });
		}
		const settings = await CognitiveSettings.findOne({ userId }).lean();
		if (!settings) {
			return res.status(200).json({ ...DEFAULT_SETTINGS });
		}
		return res.status(200).json(toSettingsResponse(settings));
	} catch (error) {
		console.error("Erro ao buscar configurações cognitivas:", error);
		return res.status(500).json({ message: "Erro ao buscar configurações cognitivas" });
	}
};

export const updateCognitiveSettings = async (req: Request, res: Response): Promise<any> => {
	try {
		const userId = req.userId;
		if (!userId) {
			return res.status(401).json({ message: "Usuário não autenticado" });
		}
		const { complexity, contrast, spacing, fontSize, alertsEnabled, alertIntervalMinutes } =
			req.body;
		const patch: Record<string, any> = {};
		if (complexity !== undefined) patch.complexity = complexity;
		if (contrast !== undefined) patch.contrast = contrast;
		if (spacing !== undefined) patch.spacing = spacing;
		if (fontSize !== undefined) patch.fontSize = fontSize;
		if (alertsEnabled !== undefined) patch.alertsEnabled = alertsEnabled;
		if (alertIntervalMinutes !== undefined) patch.alertIntervalMinutes = alertIntervalMinutes;

		const settings = await CognitiveSettings.findOneAndUpdate(
			{ userId },
			{ $set: { ...patch, userId } },
			{ upsert: true, new: true, setDefaultsOnInsert: true }
		).lean();

		return res.status(200).json(toSettingsResponse(settings));
	} catch (error) {
		console.error("Erro ao atualizar configurações cognitivas:", error);
		return res.status(500).json({ message: "Erro ao atualizar configurações cognitivas" });
	}
};

export const resetCognitiveSettings = async (req: Request, res: Response): Promise<any> => {
	try {
		const userId = req.userId;
		if (!userId) {
			return res.status(401).json({ message: "Usuário não autenticado" });
		}
		const settings = await CognitiveSettings.findOneAndUpdate(
			{ userId },
			{ $set: { ...DEFAULT_SETTINGS, userId } },
			{ upsert: true, new: true, setDefaultsOnInsert: true }
		).lean();

		return res.status(200).json(toSettingsResponse(settings));
	} catch (error) {
		console.error("Erro ao resetar configurações cognitivas:", error);
		return res.status(500).json({ message: "Erro ao resetar configurações cognitivas" });
	}
};
