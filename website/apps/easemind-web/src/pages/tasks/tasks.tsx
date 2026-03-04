import { Box, CircularProgress } from "@mui/material";
import { Suspense } from "react";
import { TaskOrganizerPage } from "../../utils/microfrontends";
import { CognitiveSettingsProvider } from "@repo/data-access";

export const TasksPage = () => {
	return (
		<Suspense
			fallback={
				<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
					minHeight="60vh"
					width="100%"
				>
					<CircularProgress sx={{ color: "#ff4353" }} />
				</Box>
			}
		>
			<CognitiveSettingsProvider>
				<TaskOrganizerPage />
			</CognitiveSettingsProvider>
		</Suspense>
	);
};
