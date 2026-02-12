import { Meta, StoryFn } from '@storybook/react';
import { Box, Typography } from '@mui/material';
import * as DocBlock from '@storybook/blocks';
import { EaseMindCardBank, EaseMindCardBankProps } from './card-bank';
import { BankCardVariant } from '../../classes';

const cardDetails = {
  name: 'Joana da Silva',
  cardNumber: '12234565665773',
  expirationDate: '12/2029',
};

export default {
  title: 'Components/Card Bank',
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: () => (
        <>
          <DocBlock.Title />
          <DocBlock.Description />
          <DocBlock.Primary />
          <DocBlock.Controls />
          <DocBlock.Stories />

          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              Variações de cartões
            </Typography>
            <Box
              width="100%"
              display="flex"
              flexDirection="row"
              flexWrap="nowrap"
              alignItems="flex-end"
              gap={4}
            >
              {[
                { name: 'Cartão Físico', variant: 'Físico' as BankCardVariant },
                { name: 'Cartão Virtual', variant: 'Virtual' as BankCardVariant },
              ].map((item) => (
                <Box
                  width="50%"
                  key={item.name}
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-start"
                >
                  <EaseMindCardBank
                  name={cardDetails.name}
                  cardNumber={cardDetails.cardNumber}
                  expirationDate={cardDetails.expirationDate}
                  variant={item.variant}
                  />
                  <Typography variant="caption" style={{ marginTop: '8px' }}>
                  {item.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </>
      ),
    },
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['Físico', 'Virtual'], // Mantém as opções corretas
    },
  },
} as Meta;

const Template: StoryFn<EaseMindCardBankProps> = (args) => <EaseMindCardBank {...args} />;

export const CreditCard = Template.bind({});
CreditCard.args = {
  name: cardDetails.name,
  cardNumber: cardDetails.cardNumber,
  expirationDate: cardDetails.expirationDate,
  variant: 'Crédito' as BankCardVariant,
};

export const DebitCard = Template.bind({});
DebitCard.args = {
  name: cardDetails.name,
  cardNumber: cardDetails.cardNumber,
  expirationDate: cardDetails.expirationDate,
  variant: 'Débito' as BankCardVariant,
};
