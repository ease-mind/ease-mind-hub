import { Meta, StoryObj } from '@storybook/react';
import { EasemindModal } from './modal';
import { useState } from 'react';
import { EasemindButton } from '../button/button';
import { EasemindModalProps } from '../../classes';

const meta: Meta<EasemindModalProps> = {
  title: 'Components/Modal',
  component: EasemindModal,
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
    title: { control: 'text' },
    onClose: { description: '' },
  },
};

export default meta;

type Story = StoryObj<EasemindModalProps>;

export const Default: Story = {
  args: {
    open: false,
    title: 'Este é o titulo do modal',
    illustration: 'register',
    illustrationSize: 'lg',
  },
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <EasemindButton
          label="Abrir Modal"
          color="primary"
          variant="contained"
          onClick={() => setOpen(true)}
        />
        <EasemindModal
          title={args.title}
          open={open}
          onClose={() => setOpen(false)}
        >
          <p style={{ marginTop: 16, textAlign: 'center' }}>
            Aqui vai o conteúdo do modal.
          </p>
        </EasemindModal>
      </>
    );
  },
};
