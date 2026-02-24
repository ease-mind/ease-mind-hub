import { Box, LinearProgress, Skeleton } from '@mui/material';
import { useUser } from '@repo/data-access';
import React, { useEffect, useState } from 'react';
import { Navigate, RouteProps, useLocation } from 'react-router-dom';

interface AuthGuardProps extends RouteProps {
    component: React.ComponentType<any>;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ component: Component, ...rest }) => {
    const location = useLocation();
    const { isAuthenticated } = useUser();
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [isAuthenticated, setLoading]);

    if (isLoading) {
        return (<>
            <Box width={'100vw'} position={'absolute'} top={0} zIndex={9999}>
                <LinearProgress variant="indeterminate" color="secondary" />
            </Box>

            <Box width={'100%'} px={4} display={'flex'} gap={4} flexDirection={'column'}>
                <Skeleton animation="wave" variant="rounded" width={'100%'} height={300} />
                <Box display={'flex'} gap={4}>
                    <Skeleton animation="wave" variant="rounded" width={'50%'} height={150} />
                    <Skeleton animation="wave" variant="rounded" width={'50%'} height={150} />

                    <Skeleton animation="wave" variant="rounded" width={'50%'} height={150} />
                    <Skeleton animation="wave" variant="rounded" width={'50%'} height={150} />
                </Box>

                <Box display={'flex'} gap={4}>
                    <Skeleton animation="wave" variant="rounded" width={'50%'} height={250} />
                    <Skeleton animation="wave" variant="rounded" width={'50%'} height={250} />
                </Box>
            </Box>
        </>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return <Component {...rest} />;
};