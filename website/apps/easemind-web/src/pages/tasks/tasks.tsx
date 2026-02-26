import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { TaskList } from '../../utils/microfrontends';

export const TasksPage = () => {
  return (
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      <Suspense 
        fallback={
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            minHeight="400px"
          >
            <CircularProgress />
          </Box>
        }
      >
        <TaskList />
      </Suspense>
    </Box>
  );
};
