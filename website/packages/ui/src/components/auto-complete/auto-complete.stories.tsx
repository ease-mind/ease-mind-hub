import * as DocBlock from '@storybook/blocks';
import { Meta, StoryObj } from '@storybook/react';
import { EasemindAutoComplete } from './auto-complete';
import { useState } from 'react';

const meta = {
  title: 'Components/AutoComplete',
  component: EasemindAutoComplete,
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
} satisfies Meta<typeof EasemindAutoComplete>;

export default meta;

type Story = StoryObj<typeof EasemindAutoComplete>;

const mockOptions = [
  { label: 'Apple', value: '1' },
  { label: 'Banana', value: '2' },
  { label: 'Orange', value: '3' },
  { label: 'Grape', value: '4' },
  { label: 'Mango', value: '5' },
];

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState<{ label: string; value: string } | null>(null);
    return (
      <EasemindAutoComplete
        {...args}
        value={value}
        onChange={setValue}
      />
    );
  },
  args: {
    options: mockOptions,
    loading: false,
    label: 'Select a fruit',
  },
};

export const WithLoading: Story = {
  render: (args) => {
    const [value, setValue] = useState<{ label: string; value: string } | null>(null);
    return (
      <EasemindAutoComplete
        {...args}
        value={value}
        onChange={setValue}
      />
    );
  },
  args: {
    options: mockOptions,
    loading: true,
    label: 'Loading options...',
  },
};

export const WithError: Story = {
  render: (args) => {
    const [value, setValue] = useState<{ label: string; value: string } | null>(null);
    return (
      <EasemindAutoComplete
        {...args}
        value={value}
        onChange={setValue}
      />
    );
  },
  args: {
    options: mockOptions,
    loading: false,
    label: 'Select a fruit',
    error: true,
    helperText: 'This field is required',
  },
};

export const WithCreateOption: Story = {
  render: (args) => {
    const [value, setValue] = useState<{ label: string; value: string } | null>(null);
    const [options, setOptions] = useState(mockOptions);

    const handleCreateOption = async (label: string) => {
      const newOption = { label, value: String(options.length + 1) };
      setOptions([...options, newOption]);
      setValue(newOption);
    };

    return (
      <EasemindAutoComplete
        {...args}
        options={options}
        value={value}
        onChange={setValue}
        onCreateOption={handleCreateOption}
      />
    );
  },
  args: {
    loading: false,
    label: 'Select or create a fruit',
  },
};
