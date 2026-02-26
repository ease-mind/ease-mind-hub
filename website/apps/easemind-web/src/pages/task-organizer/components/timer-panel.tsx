import {
	Pause as PauseIcon,
	PlayArrow as PlayArrowIcon,
	Refresh as RefreshIcon,
	Timer as TimerIcon
} from "@mui/icons-material";
import { Box, Chip, IconButton, Typography } from "@mui/material";
import { EaseMindButton } from "@repo/ui";
import { useFocusTimer } from "../../../hooks/use-focus-timer/use-focus-timer";

interface TimerPanelProps {
	timer: ReturnType<typeof useFocusTimer>;
	isDarkMode: boolean;
	cardBg: string;
	textPrimary?: string;
	textSecondary?: string;
}

const PRESETS = [15, 25, 45];

export function TimerPanel({
	timer,
	isDarkMode,
	cardBg,
	textPrimary,
	textSecondary
}: TimerPanelProps) {
	return (
		<Box className="timer-panel" sx={{ background: cardBg }}>
			<Box display="flex" alignItems="center" gap={1} mb={1}>
				<TimerIcon sx={{ color: "#ff4353" }} />
				<Typography variant="subtitle1" fontWeight={700} color={textPrimary}>
					Tempo de foco
				</Typography>
			</Box>

			<Box className="timer-circle" sx={{ borderColor: "rgba(255,67,83,0.3)" }}>
				<Typography variant="h3" fontWeight={700} color={textPrimary}>
					{timer.display}
				</Typography>
				<Typography variant="caption" color={textSecondary}>
					{timer.state === "running"
						? "Focando..."
						: timer.state === "paused"
							? "Pausado"
							: "Pronto"}
				</Typography>
			</Box>

			<Box display="flex" gap={1} justifyContent="center" mt={1}>
				{PRESETS.map(m => (
					<Chip
						key={m}
						label={`${m}min`}
						clickable
						onClick={() => timer.setMinutes(m)}
						size="small"
						sx={{
							fontWeight: 600,
							color: textPrimary,
							...(timer.totalSeconds === m * 60 && timer.state === "idle"
								? {
										backgroundColor: isDarkMode
											? "rgba(255,67,83,0.12)"
											: "#fef2f2",
										color: "#ff4353"
									}
								: {})
						}}
					/>
				))}
			</Box>

			<Box display="flex" gap={1} justifyContent="center" mt={1.5}>
				{timer.state === "idle" || timer.state === "paused" ? (
					<EaseMindButton
						variant="contained"
						color="secondary"
						label={timer.state === "paused" ? "Retomar" : "Iniciar"}
						onClick={timer.state === "paused" ? timer.resume : timer.start}
						startIcon={<PlayArrowIcon />}
						borderRadius="8px"
						sx={{
							background: "linear-gradient(90deg, #FF4353 0%, #FF4353 100%)",
							color: "#fff !important"
						}}
					/>
				) : (
					<EaseMindButton
						variant="contained"
						color="secondary"
						label="Pausar"
						onClick={timer.pause}
						startIcon={<PauseIcon />}
						borderRadius="8px"
						sx={{
							background: "linear-gradient(90deg, #FF4353 0%, #FF4353 100%)",
							color: "#fff !important"
						}}
					/>
				)}
				<IconButton
					onClick={timer.reset}
					title="Reiniciar"
					sx={{ color: isDarkMode ? "#FFB5BD" : undefined }}
				>
					<RefreshIcon />
				</IconButton>
			</Box>
		</Box>
	);
}
