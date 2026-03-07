import * as DocBlock from '@storybook/blocks';
import { Meta, StoryObj } from '@storybook/react';
import { EasemindButtonFileUpload } from './file-upload';
import { useState } from 'react';

const meta = {
  title: 'Components/FileUpload',
  component: EasemindButtonFileUpload,
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
} satisfies Meta<typeof EasemindButtonFileUpload>;

export default meta;

type Story = StoryObj<typeof EasemindButtonFileUpload>;

export const Default: Story = {
  render: (args) => {
    const [file, setFile] = useState<File | null>(null);
    return (
      <EasemindButtonFileUpload
        {...args}
        value={file}
        onChange={setFile}
      />
    );
  },
  args: {
    label: 'SELECIONAR ARQUIVO',
  },
};

export const WithSelectedFile: Story = {
  render: (args) => {
    const [file, setFile] = useState<File | null>(
      new File(['dummy content'], 'example-document.pdf', { type: 'application/pdf' })
    );
    return (
      <EasemindButtonFileUpload
        {...args}
        value={file}
        onChange={setFile}
      />
    );
  },
  args: {
    label: 'SELECIONAR ARQUIVO',
  },
};

export const CustomLabel: Story = {
  render: (args) => {
    const [file, setFile] = useState<File | null>(null);
    return (
      <EasemindButtonFileUpload
        {...args}
        value={file}
        onChange={setFile}
      />
    );
  },
  args: {
    label: 'ESCOLHER IMAGEM',
  },
};
