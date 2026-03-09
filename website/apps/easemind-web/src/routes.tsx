import { Routes, Route } from 'react-router-dom';
import { AuthGuard } from './infrastructure/guards/auth.guard';
import { PublicGuard } from './infrastructure/guards/public.guard';
import EasemindHomePage from './presentation/pages/home/home';
import NotFound from './presentation/pages/not-found/not-found';
import { TasksPage } from './presentation/pages/tasks';
import EasemindThermometerPage from './presentation/pages/thermometer/thermometer';
import EasemindProfilePage from './presentation/pages/profile/profile';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<PublicGuard component={EasemindHomePage} />} />
    <Route
      path="/termometro"
      element={<AuthGuard component={EasemindThermometerPage} />}
    />
    <Route path="/tarefas" element={<AuthGuard component={TasksPage} />} />
    <Route path="/*" element={<NotFound />} />
    <Route path="/minha-conta" element={<AuthGuard component={EasemindProfilePage} />} />
  </Routes>
);

export default AppRoutes;
