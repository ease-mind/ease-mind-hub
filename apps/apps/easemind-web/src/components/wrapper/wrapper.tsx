import { EaseMindThemeProvider } from '@repo/utils';
import { Box, CssBaseline } from '@mui/material';
import { EaseMindHeader } from '../header/header';
import { EaseMindFooter } from '../footer/footer';

export interface WrapperRouteProps {
  name: string;
  route: string;
  disabled?: boolean;
}

export function EaseMindWrapper({
  canNavigate = true,
  children,
}: {
  routes?: WrapperRouteProps[];
  canNavigate?: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      <EaseMindThemeProvider>
        <CssBaseline />
        {canNavigate ? <EaseMindHeader /> : ''}
        <Box sx={{ display: 'flex', overflow: 'hidden'}}>
          <Box pt={2} display={'flex'} flex={1}>
            {children}
          </Box>
        </Box>
        {canNavigate ? <EaseMindFooter /> : ''}
      </EaseMindThemeProvider>
    </>
  );
}
