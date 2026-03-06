import * as DocBlock from '@storybook/blocks';
import { Meta, StoryObj } from '@storybook/react';
import { EaseMindLinearProgress } from './linear-progress';
import { Box } from '@mui/material';
import { EaseMindText } from '../text/text';

const meta = {
  title: 'Components/LinearProgress',
  component: EaseMindLinearProgress,
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
} satisfies Meta<typeof EaseMindLinearProgress>;

export default meta;

type Story = StoryObj<typeof EaseMindLinearProgress>;

export const Primary: Story = {
  args: {
    value: 50,
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    value: 75,
    variant: 'secondary',
  },
};

export const SmallHeight: Story = {
  args: {
    value: 60,
    height: 8,
    variant: 'primary',
  },
};

export const LargeHeight: Story = {
  args: {
    value: 80,
    height: 20,
    variant: 'primary',
  },
};

export const MultipleProgress: Story = {
  render: () =>
    <Box display="flex" flexDirection="column" gap={3}>
      <Box>
        <EaseMindText variant="sm" sx={{ mb: 1 }}>Loading: 25%</EaseMindText>
        <EaseMindLinearProgress value={25} variant="primary" />
      </Box>
      <Box>
        <EaseMindText variant="sm" sx={{ mb: 1 }}>Processing: 50%</EaseMindText>
        <EaseMindLinearProgress value={50} variant="primary" />
      </Box>
      <Box>
        <EaseMindText variant="sm" sx={{ mb: 1 }}>Almost done: 75%</EaseMindText>
        <EaseMindLinearProgress value={75} variant="secondary" />
      </Box>
      <Box>
        <EaseMindText variant="sm" sx={{ mb: 1 }}>Complete: 100%</EaseMindText>
        <EaseMindLinearProgress value={100} variant="secondary" />
      </Box>
    </Box>
};
