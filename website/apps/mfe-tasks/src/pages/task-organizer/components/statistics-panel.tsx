import { TrendingUp as TrendingUpIcon } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

interface StatisticsPanelProps {
	totalTasks: number;
	completedCount: number;
	inProgressCount: number;
	progressPercent: number;
	isDarkMode: boolean;
	cardBg: string;
	textPrimary?: string;
	textSecondary?: string;
}

export function StatisticsPanel({
	totalTasks,
	completedCount,
	inProgressCount,
	progressPercent,
	isDarkMode,
	cardBg,
	textPrimary,
	textSecondary
}: StatisticsPanelProps) {
	const statItemBg = isDarkMode ? "rgba(255,255,255,0.06)" : "#fff5f5";

	return (
		<Box className="stats-panel" sx={{ background: cardBg }}>
			<Box display="flex" alignItems="center" gap={1} mb="12px">
				<TrendingUpIcon sx={{ color: "#ff4353" }} />
				<Typography variant="subtitle1" fontWeight={700} color={textPrimary}>
					Estatísticas
				</Typography>
			</Box>
			<Box className="stats-grid">
				{[
					{ value: totalTasks, label: "Tarefas Hoje" },
					{ value: completedCount, label: "Concluídas" },
					{ value: inProgressCount, label: "Em Progresso" },
					{ value: `${progressPercent}%`, label: "Produtividade" }
				].map(({ value, label }) => (
					<Box key={label} className="stats-item" sx={{ background: statItemBg }}>
						<Typography variant="h5" fontWeight={700} color="#ff4353">
							{value}
						</Typography>
						<Typography variant="caption" color={textSecondary}>
							{label}
						</Typography>
					</Box>
				))}
			</Box>
		</Box>
	);
}
