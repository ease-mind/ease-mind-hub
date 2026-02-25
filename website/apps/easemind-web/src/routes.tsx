import { Routes, Route } from 'react-router-dom';
import EaseMindHomePage from './pages/home/home';
import EaseMindDashboardPage from './pages/thermometer/thermometer';
import NotFound from './pages/not-found/not-found';
import Profile from './pages/profile/profile';
import { TasksPage } from './pages/tasks';
import { AuthGuard } from './guards/auth.guard';
import { PublicGuard } from './guards/public.guard';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<PublicGuard component={EaseMindHomePage} />} />
    <Route
      path="/termometro"
      element={<AuthGuard component={EaseMindDashboardPage} />}
    />
    <Route path="/tarefas" element={<AuthGuard component={TasksPage} />} />
    <Route path="/*" element={<NotFound />} />
    <Route path="/minha-conta" element={<AuthGuard component={Profile} />} />
  </Routes>
);

export default AppRoutes;
