import { Lightbulb as TipIcon } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { TipDef } from "../types";

interface TipsPanelProps {
	tips: TipDef[];
	title: string;
	isDarkMode: boolean;
	cardBg: string;
	textPrimary?: string;
	textSecondary?: string;
}

export function TipsPanel({
	tips,
	title,
	isDarkMode,
	cardBg,
	textPrimary,
	textSecondary
}: TipsPanelProps) {
	return (
		<Box className="tips-panel" sx={{ background: cardBg }}>
			<Box display="flex" alignItems="center" gap={1} mb="12px">
				<TipIcon sx={{ color: "#ff4353" }} />
				<Typography variant="subtitle1" fontWeight={700} color={textPrimary}>
					{title}
				</Typography>
			</Box>
			{tips.map((tip, i) => (
				<Box
					key={i}
					className="tip-item"
					sx={{ background: isDarkMode ? "rgba(255,255,255,0.06)" : `${tip.iconBg}66` }}
				>
					<Box className="tip-icon" sx={{ background: tip.iconBg, color: tip.iconColor }}>
						{tip.icon}
					</Box>
					<Box>
						<Typography variant="body2" fontWeight={600} color={textPrimary}>
							{tip.title}
						</Typography>
						<Typography variant="caption" color={textSecondary}>
							{tip.description}
						</Typography>
					</Box>
				</Box>
			))}
		</Box>
	);
}
