import { Assignment as AssignmentIcon } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { EaseMindButton, EaseMindModal } from "@repo/ui";

interface CognitiveAlertModalProps {
	open: boolean;
	onContinue: () => void;
	onStop: () => void;
	isDarkMode: boolean;
	textSecondary?: string;
	minutes: number;
}

export function CognitiveAlertModal({
	open,
	onContinue,
	onStop,
	isDarkMode,
	textSecondary,
	minutes
}: CognitiveAlertModalProps) {
	return (
		<EaseMindModal open={open} onClose={onContinue} title="Alerta Cognitivo">
			<Box
				display="flex"
				flexDirection="column"
				gap={2}
				alignItems="center"
				textAlign="center"
				py={1}
			>
				<AssignmentIcon sx={{ fontSize: "3rem", color: "#ff4353" }} />
				<Box display="flex" flexDirection="column" alignItems="center" gap="2px">
					<Typography variant="body1" fontWeight={600}>
						Você está focado há {minutes} minutos
					</Typography>
					<Typography variant="body2" color={textSecondary}>
						Considere fazer uma pausa curta para manter sua produtividade e bem-estar.
						Levante-se, alongue-se ou tome um copo de água.
					</Typography>
				</Box>
				<Box display="flex" gap={1} width="100%" mt={1}>
					<EaseMindButton
						variant="outlined"
						color="secondary"
						label="Continuar foco"
						onClick={onContinue}
						borderRadius="8px"
						sx={{
							flex: 1,
							borderColor: isDarkMode ? "rgba(255,255,255,0.15)" : "#e5e7eb",
							color: isDarkMode ? "#ffd5d5" : "#374151"
						}}
					/>
					<EaseMindButton
						variant="contained"
						color="secondary"
						label="Encerrar foco"
						onClick={onStop}
						borderRadius="8px"
						sx={{
							flex: 1,
							background: "linear-gradient(90deg, #FF4353 0%, #FF4353 100%)",
							color: "#fff !important"
						}}
					/>
				</Box>
			</Box>
		</EaseMindModal>
	);
}
