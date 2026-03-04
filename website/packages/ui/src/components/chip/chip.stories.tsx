import * as DocBlock from '@storybook/blocks';
import { Meta, StoryObj } from '@storybook/react';
import { EaseMindChip } from './chip';
import { Box } from '@mui/material';

const meta = {
  title: 'Components/Chip',
  component: EaseMindChip,
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
} satisfies Meta<typeof EaseMindChip>;

export default meta;

type Story = StoryObj<typeof EaseMindChip>;

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
      <EaseMindChip label="JavaScript" onClick={() => console.log('JavaScript')} />
      <EaseMindChip label="TypeScript" onClick={() => console.log('TypeScript')} />
      <EaseMindChip label="React" onClick={() => console.log('React')} />
      <EaseMindChip label="Node.js" onClick={() => console.log('Node.js')} />
      <EaseMindChip label="MongoDB" onClick={() => console.log('MongoDB')} />
    </Box>
};
