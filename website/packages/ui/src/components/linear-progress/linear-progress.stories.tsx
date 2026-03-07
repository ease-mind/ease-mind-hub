import * as DocBlock from '@storybook/blocks';
import { Meta, StoryObj } from '@storybook/react';
import { EasemindLinearProgress } from './linear-progress';
import { Box } from '@mui/material';
import { EasemindText } from '../text/text';

const meta = {
  title: 'Components/LinearProgress',
  component: EasemindLinearProgress,
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
} satisfies Meta<typeof EasemindLinearProgress>;

export default meta;

type Story = StoryObj<typeof EasemindLinearProgress>;

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
        <EasemindText variant="sm" sx={{ mb: 1 }}>Loading: 25%</EasemindText>
        <EasemindLinearProgress value={25} variant="primary" />
      </Box>
      <Box>
        <EasemindText variant="sm" sx={{ mb: 1 }}>Processing: 50%</EasemindText>
        <EasemindLinearProgress value={50} variant="primary" />
      </Box>
      <Box>
        <EasemindText variant="sm" sx={{ mb: 1 }}>Almost done: 75%</EasemindText>
        <EasemindLinearProgress value={75} variant="secondary" />
      </Box>
      <Box>
        <EasemindText variant="sm" sx={{ mb: 1 }}>Complete: 100%</EasemindText>
        <EasemindLinearProgress value={100} variant="secondary" />
      </Box>
    </Box>
};
