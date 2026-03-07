import { Box, CssBaseline } from "@mui/material";
import { EasemindThemeProvider } from "@repo/utils";
import { EasemindFooter } from "../footer/footer";
import { EasemindHeader } from "../header/header";

export interface WrapperRouteProps {
	name: string;
	route: string;
	disabled?: boolean;
}

export function EasemindWrapper({
	canNavigate = true,
	children
}: {
	routes?: WrapperRouteProps[];
	canNavigate?: boolean;
	children: React.ReactNode;
}) {
	return (
		<>
			<EasemindThemeProvider>
				<CssBaseline />
				{canNavigate ? <EasemindHeader /> : ""}
				<Box sx={{ display: "flex", overflow: "hidden" }}>
					<Box display={"flex"} flex={1}>
						{children}
					</Box>
				</Box>
				{canNavigate ? <EasemindFooter /> : ""}
			</EasemindThemeProvider>
		</>
	);
}
