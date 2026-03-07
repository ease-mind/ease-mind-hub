import * as DocBlock from '@storybook/blocks';
import { Meta, StoryObj } from '@storybook/react';
import { EasemindToggleButton } from './toggle-theme';
import { Box } from '@mui/material';
import { EasemindText } from '../text/text';

const meta = {
  title: 'Components/ToggleTheme',
  component: EasemindToggleButton,
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
} satisfies Meta<typeof EasemindToggleButton>;

export default meta;

type Story = StoryObj<typeof EasemindToggleButton>;

export const Default: Story = {
  render: () =>
    <Box display="flex" alignItems="center" gap={2}>
      <EasemindText variant="sm">Toggle Dark Mode:</EasemindText>
      <EasemindToggleButton />
    </Box>
};

export const Standalone: Story = {
  render: () => <EasemindToggleButton />
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
      <EasemindText variant="lg" sx={{ fontWeight: 600 }}>
        Application Header
      </EasemindText>
      <Box display="flex" gap={2} alignItems="center">
        <EasemindText variant="sm">Theme:</EasemindText>
        <EasemindToggleButton />
      </Box>
    </Box>
};
