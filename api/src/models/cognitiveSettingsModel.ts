import { Schema, model } from "mongoose";

export interface ICognitiveSettings {
	userId: string;
	complexity: "simple" | "complete";
	contrast: "low" | "normal" | "high";
	spacing: 12 | 14 | 18;
	fontSize: 12 | 14 | 18;
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
			enum: [12, 14, 18],
			default: 12
		},
		fontSize: {
			type: Number,
			enum: [12, 14, 18],
			default: 14
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
