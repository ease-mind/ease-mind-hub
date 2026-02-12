// guards/public.guard.tsx
import { useUser } from '@repo/data-access';
import { Navigate } from 'react-router-dom';

interface PublicGuardProps {
    component: React.ComponentType;
}

export const PublicGuard = ({ component: Component }: PublicGuardProps) => {
    const { user } = useUser();

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Component />;
};
