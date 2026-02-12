import * as DocBlock from '@storybook/blocks';
import { Meta, StoryObj } from '@storybook/react';
import { EaseMindButton } from './button';

const meta = {
  title: 'Components/Button',
  component: EaseMindButton,
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
} satisfies Meta<typeof EaseMindButton>;

export default meta;

type Story = StoryObj<typeof EaseMindButton>;

export const Primary: Story = {
  args: {
    label: 'Label',
    color: 'primary',
    variant: 'contained',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Label',
    color: 'secondary',
    variant: 'contained',
  },
};

export const Tertiary: Story = {
  args: {
    label: 'Label',
    color: 'tertiary',
    variant: "contained",
  },
};

export const Contained: Story = {
  args: {
    label: 'Label',
    color: 'primary',
    variant: "contained",
  },
};

export const Outlined: Story = {
  args: {
    label: 'Label',
    color: 'primary',
    variant: "outlined",
  },
};

