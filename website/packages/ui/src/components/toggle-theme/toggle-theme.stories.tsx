import * as DocBlock from '@storybook/blocks';
import { Meta, StoryObj } from '@storybook/react';
import { EaseMindToggleButton } from './toggle-theme';
import { Box } from '@mui/material';
import { EaseMindText } from '../text/text';

const meta = {
  title: 'Components/ToggleTheme',
  component: EaseMindToggleButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: () =>
        <>
          <DocBlock.Title />
          <DocBlock.Description />
          <DocBlock.Primary />
          <DocBlock.Controls />
          <DocBlock.Title>Variações</DocBlock.Title>
          <DocBlock.Stories />
        </>
    }
  }
} satisfies Meta<typeof EaseMindToggleButton>;

export default meta;

type Story = StoryObj<typeof EaseMindToggleButton>;

export const Default: Story = {
  render: () =>
    <Box display="flex" alignItems="center" gap={2}>
      <EaseMindText variant="sm">Toggle Dark Mode:</EaseMindText>
      <EaseMindToggleButton />
    </Box>
};

export const Standalone: Story = {
  render: () => <EaseMindToggleButton />
};

export const InHeader: Story = {
  render: () =>
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={2}
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1,
      }}
    >
      <EaseMindText variant="lg" sx={{ fontWeight: 600 }}>
        Application Header
      </EaseMindText>
      <Box display="flex" gap={2} alignItems="center">
        <EaseMindText variant="sm">Theme:</EaseMindText>
        <EaseMindToggleButton />
      </Box>
    </Box>
};
