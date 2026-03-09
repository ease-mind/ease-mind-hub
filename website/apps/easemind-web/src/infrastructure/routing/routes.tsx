import { Route, Routes } from "react-router-dom";
import { AuthGuard } from "../guards/auth.guard";
import { PublicGuard } from "../guards/public.guard";
import CognitiveSettingsPage from "../../presentation/pages/cognitive-settings/cognitive-settings";
import EaseMindHomePage from "../../presentation/pages/home/home";
import NotFound from "../../presentation/pages/not-found/not-found";
import Profile from "../../presentation/pages/profile/profile";
import { TasksPage } from "../../presentation/pages/tasks";
import EaseMindDashboardPage from "../../presentation/pages/thermometer/thermometer";

const AppRoutes = () => (
	<Routes>
		<Route path="/" element={<PublicGuard component={EaseMindHomePage} />} />
		<Route path="/*" element={<NotFound />} />
		<Route path="/termometro" element={<AuthGuard component={EaseMindDashboardPage} />} />
		<Route path="/minha-conta" element={<AuthGuard component={Profile} />} />
		<Route path="/configuracoes" element={<AuthGuard component={CognitiveSettingsPage} />} />
		<Route path="/tarefas" element={<AuthGuard component={TasksPage} />} />
	</Routes>
);

export default AppRoutes;
