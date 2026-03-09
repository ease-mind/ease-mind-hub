import { Box, CircularProgress } from "@mui/material";
import { Suspense } from "react";
import { TaskOrganizerPage } from "../../../utils/microfrontends";
import { useTheme } from "@repo/utils";

export const TasksPage = () => {
	const { colors, isDarkMode } = useTheme();
	const pageBg = isDarkMode ? colors.background : "#fef3f1";

	return (
		<Box sx={{ background: pageBg, minHeight: "100vh", width: "100%" }}>
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
				<TaskOrganizerPage />
			</Suspense>
		</Box>
	);
};
