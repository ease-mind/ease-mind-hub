import { Schema, model } from "mongoose";

export interface ICognitiveSettings {
	userId: string;
	complexity: "simple" | "complete";
	contrast: "low" | "normal" | "high";
	spacing: 12 | 18 | 24;
	fontSize: 12 | 18 | 24;
	alertsEnabled: boolean;
	alertIntervalMinutes: number;
}

const cognitiveSettingsSchema = new Schema<ICognitiveSettings>(
	{
		userId: { type: String, required: true, unique: true, index: true },
		complexity: {
			type: String,
			enum: ["simple", "complete"],
			default: "complete"
		},
		contrast: {
			type: String,
			enum: ["low", "normal", "high"],
			default: "normal"
		},
		spacing: {
			type: Number,
			enum: [12, 18, 24],
			default: 18
		},
		fontSize: {
			type: Number,
			enum: [12, 18, 24],
			default: 18
		},
		alertsEnabled: { type: Boolean, default: true },
		alertIntervalMinutes: { type: Number, default: 30 }
	},
	{
		timestamps: true
	}
);

const CognitiveSettings = model<ICognitiveSettings>("CognitiveSettings", cognitiveSettingsSchema);

export default CognitiveSettings;
