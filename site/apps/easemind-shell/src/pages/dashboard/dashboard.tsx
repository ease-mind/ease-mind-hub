import { FC } from 'react';
import { Box } from '@mui/material';

interface EaseMindDashboardProps { }

const EaseMindDashboardPage: FC<EaseMindDashboardProps> = () => {

  return (
    <>
      <Box width={'100%'} px={{xs: 1, sm: 2, md: 4}} pb={2} display={'flex'} flexDirection={'column'} gap={2}>
        <Box>
          <Box display="grid" gridTemplateColumns="1fr 2fr " gap={2} sx={{ gridTemplateColumns: { xs: '1fr', sm: '1fr', md: '1fr 2fr' }}}>
            <Box textAlign="left" height={'100vh'} overflow={'hidden'}>
              {/* Área para futuros componentes */}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default EaseMindDashboardPage;
