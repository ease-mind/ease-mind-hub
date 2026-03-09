import React from "react";

export type SectionId = "complexity" | "contrast" | "spacing" | "fontSize" | "alerts";

export interface SectionDef {
	id: SectionId;
	label: string;
	icon: React.ReactNode;
	iconColor: string;
	iconBg: string;
}
