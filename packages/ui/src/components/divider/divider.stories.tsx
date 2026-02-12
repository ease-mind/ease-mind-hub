import * as DocBlock from '@storybook/blocks';
import { Meta, StoryObj } from '@storybook/react';
import { EaseMindDivider } from './divider';

const meta = {
  title: 'Components/Divider', // O título aqui deve estar correto
  component: EaseMindDivider,
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
} satisfies Meta<typeof EaseMindDivider>;

export default meta;

type Story = StoryObj<typeof EaseMindDivider>;

export const Primary: Story = {
  args: {
    color: 'primary',
    type: 'horizontal',
  },
};