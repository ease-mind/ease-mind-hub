import * as DocBlock from '@storybook/blocks';
import { Meta, StoryObj } from '@storybook/react';
import { EasemindChip } from './chip';
import { Box } from '@mui/material';

const meta = {
  title: 'Components/Chip',
  component: EasemindChip,
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
} satisfies Meta<typeof EasemindChip>;

export default meta;

type Story = StoryObj<typeof EasemindChip>;

export const Default: Story = {
  args: {
    label: 'Chip Label',
  },
};

export const WithClick: Story = {
  args: {
    label: 'Clickable Chip',
    onClick: () => alert('Chip clicked!'),
  },
};

export const LongLabel: Story = {
  args: {
    label: 'This is a very long chip label that will be truncated',
  },
};

export const MultipleChips: Story = {
  render: () =>
    <Box display="flex" gap={1} flexWrap="wrap">
      <EasemindChip label="JavaScript" onClick={() => console.log('JavaScript')} />
      <EasemindChip label="TypeScript" onClick={() => console.log('TypeScript')} />
      <EasemindChip label="React" onClick={() => console.log('React')} />
      <EasemindChip label="Node.js" onClick={() => console.log('Node.js')} />
      <EasemindChip label="MongoDB" onClick={() => console.log('MongoDB')} />
    </Box>
};
