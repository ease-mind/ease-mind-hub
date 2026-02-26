import { Route, Routes } from "react-router-dom";
import { AuthGuard } from "./guards/auth.guard";
import { PublicGuard } from "./guards/public.guard";
import CognitiveSettingsPage from "./pages/cognitive-settings/cognitive-settings";
import EaseMindHomePage from "./pages/home/home";
import NotFound from "./pages/not-found/not-found";
import Profile from "./pages/profile/profile";
import TaskOrganizerPage from "./pages/task-organizer/task-organizer";
import { TasksPage } from "./pages/tasks";
import EaseMindDashboardPage from "./pages/thermometer/thermometer";

const AppRoutes = () => (
	<Routes>
		<Route path="/" element={<PublicGuard component={EaseMindHomePage} />} />
		<Route path="/*" element={<NotFound />} />
		<Route path="/termometro" element={<AuthGuard component={EaseMindDashboardPage} />} />
		<Route path="/minha-conta" element={<AuthGuard component={Profile} />} />
		<Route path="/configuracoes" element={<AuthGuard component={CognitiveSettingsPage} />} />
		<Route path="/tarefas" element={<AuthGuard component={TaskOrganizerPage} />} />

		{/* TODO */}
		<Route path="/tarefas-mfe" element={<AuthGuard component={TasksPage} />} />
	</Routes>
);

export default AppRoutes;
