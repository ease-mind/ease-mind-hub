import { Box, Typography } from "@mui/material";
import React from "react";

interface SectionCardProps {
	icon: React.ReactNode;
	title: string;
	subtitle: string;
	children: React.ReactNode;
	cardBg: string;
	iconBg: string;
	borderSubtle: string;
	textPrimary: string;
	textSecondary: string;
}

export function SectionCard({
	icon,
	title,
	subtitle,
	children,
	cardBg,
	iconBg,
	borderSubtle,
	textPrimary,
	textSecondary
}: SectionCardProps) {
	return (
		<Box
			className="cog-section-card"
			sx={{ background: cardBg, border: `1px solid ${borderSubtle}` }}
		>
			<Box className="cog-section-card__header">
				<Box className="cog-section-card__icon" sx={{ background: iconBg }}>
					{icon}
				</Box>
				<Box display="flex" flexDirection="column" gap={0}>
					<Typography variant="subtitle1" fontWeight={700} color={textPrimary}>
						{title}
					</Typography>
					<Typography variant="caption" color={textSecondary}>
						{subtitle}
					</Typography>
				</Box>
			</Box>
			<Box className="cog-section-card__body">{children}</Box>
		</Box>
	);
}
