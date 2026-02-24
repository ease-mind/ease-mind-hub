import { Meta, StoryObj } from '@storybook/react';
import * as DocBlock from '@storybook/blocks';
import { EaseMindText, EaseMindTextProps } from './text';

const SIMPLE_TEXT = 'The quick brown fox jumps over the lazy dog';

const meta = {
  title: 'Components/Text',
  component: EaseMindText,
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: () => (
        <>
          <DocBlock.Title />
          <DocBlock.Description />
          <DocBlock.Primary />
          <DocBlock.Controls />
          <DocBlock.Title>Variações</DocBlock.Title>
          <DocBlock.Stories />
        </>
      ),
    },
  },
} satisfies Meta<typeof EaseMindText>;

export default meta;

type Story = StoryObj<EaseMindTextProps>;

export const H1: Story = {
  args: {
    children: SIMPLE_TEXT,
    color: 'black',
    variant: 'h1', 
    align: 'center', // Propriedade do Material UI
    gutterBottom: true, // Propriedade do Material UI
  },
};

export const Primary: Story = {
  args: {
    children: SIMPLE_TEXT,
    color: 'primary',
    variant: 'sm',
    align: 'center', // Propriedade do Material UI
    gutterBottom: true, // Propriedade do Material UI
  },
};

export const Secondary: Story = {
  args: {
    children: SIMPLE_TEXT,
    color: 'secondary',
    variant: 'md',
    align: 'left', // Propriedade do Material UI
    gutterBottom: false, // Propriedade do Material UI
    noWrap: true, // Propriedade do Material UI
  },
};

export const Tertiary: Story = {
  args: {
    children: SIMPLE_TEXT,
    color: 'tertiary',
    variant: 'lg',
    align: 'left', // Propriedade do Material UI
    paragraph: true, // Propriedade do Material UI
  },
};

export const Success: Story = {
  args: {
    children: SIMPLE_TEXT,
    color: 'success',
    variant: 'sm',
    align: 'right', // Propriedade do Material UI
    paragraph: true, // Propriedade do Material UI
  },
};

export const Info: Story = {
  args: {
    children: SIMPLE_TEXT,
    color: 'info',
    variant: 'md',
    align: 'justify', // Propriedade do Material UI
    gutterBottom: true, // Propriedade do Material UI
    noWrap: false, // Propriedade do Material UI
  },
};

export const Error: Story = {
  args: {
    children: SIMPLE_TEXT,
    color: 'error',
    variant: 'lg',
    align: 'inherit', // Propriedade do Material UI
    gutterBottom: true, // Propriedade do Material UI
    paragraph: false, // Propriedade do Material UI
  },
};

export const Light: Story = {
    args: {
      children: SIMPLE_TEXT,
      color: 'white',
      variant: 'lg',
      align: 'inherit', // Propriedade do Material UI
      gutterBottom: true, // Propriedade do Material UI
      paragraph: false, // Propriedade do Material UI
    },
  };