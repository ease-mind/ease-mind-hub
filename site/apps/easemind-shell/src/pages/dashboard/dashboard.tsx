import { FC, useState } from 'react';
import { EaseMindBalanceCard } from '../../components/balance-card/balance-card';
import { Box, Typography } from '@mui/material';
import { EaseMindButton, EaseMindModal } from '@repo/ui';
import { EaseMindTransactionCard } from '../../components/transaction-card/transaction-card';

interface EaseMindDashboardProps { }

const EaseMindDashboardPage: FC<EaseMindDashboardProps> = () => {
  const [openModal, setModalOpen] = useState(false);

  return (
    <>
      <Box width={'100%'} px={{xs: 1, sm: 2, md: 4}} pb={2} display={'flex'} flexDirection={'column'} gap={2}>
        <Box>
          <EaseMindBalanceCard />
        </Box>
        <Box>
          <Box display="grid" gridTemplateColumns="1fr 2fr " gap={2} sx={{ gridTemplateColumns: { xs: '1fr', sm: '1fr', md: '1fr 2fr' }}}>
            <Box>
              <EaseMindTransactionCard />
            </Box>
            <Box textAlign="left" height={'100%'} overflow={'hidden'}>
              {/* Área para futuros componentes */}
            </Box>
          </Box>
        </Box>
        <EaseMindModal
          open={openModal}
          title="Confirmar exclusão"
          illustrationShow={false}
          onClose={() => setModalOpen(false)}
        >
          <Box>
            <Typography style={{ marginBottom: 16 }}>
              Tem certeza que deseja excluir este item?
            </Typography>
            <Box style={{ display: 'flex', gap: 8 }}>
              <EaseMindButton
                label="Sim"
                color="secondary"
                variant="outlined"
              />
              <EaseMindButton
                label="Não"
                color="secondary"
                variant="contained"
              />
            </Box>
          </Box>
        </EaseMindModal>
      </Box>
    </>
  );
};

export default EaseMindDashboardPage;
