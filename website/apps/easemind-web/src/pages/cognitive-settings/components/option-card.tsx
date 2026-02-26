import { Box, Typography } from "@mui/material";
import React from "react";

interface OptionCardProps {
	selected: boolean;
	onClick: () => void;
	icon: React.ReactNode;
	label: string;
	description: string;
	optionBorder: string;
	selectedBg: string;
	accentColor: string;
	iconRingBg: string;
	textPrimary: string;
	textSecondary: string;
}

export function OptionCard({
	selected,
	onClick,
	icon,
	label,
	description,
	optionBorder,
	selectedBg,
	accentColor,
	iconRingBg,
	textPrimary,
	textSecondary
}: OptionCardProps) {
	return (
		<Box
			className={`cog-option-card ${selected ? "cog-option-card--selected" : ""}`}
			onClick={onClick}
			tabIndex={0}
			role="button"
			onKeyDown={e => e.key === "Enter" && onClick()}
			sx={{
				borderColor: selected ? accentColor : optionBorder,
				background: selected ? selectedBg : "transparent",
				"&:hover": { borderColor: selected ? accentColor : "#ffcdc8" }
			}}
		>
			<Box className="cog-option-card__icon" sx={{ background: iconRingBg }}>
				{icon}
			</Box>
			<Typography variant="body2" fontWeight={600} color={textPrimary}>
				{label}
			</Typography>
			<Typography variant="caption" color={textSecondary}>
				{description}
			</Typography>
		</Box>
	);
}
