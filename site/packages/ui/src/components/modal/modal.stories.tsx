import { Meta, StoryObj } from '@storybook/react';
import { EaseMindModal } from './modal';
import { useState } from 'react';
import { EaseMindButton } from '../button/button';
import { EaseMindModalProps } from '../../classes';

const meta: Meta<EaseMindModalProps> = {
  title: 'Components/Modal',
  component: EaseMindModal,
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
    title: { control: 'text' },
    onClose: { description: '' },
  },
};

export default meta;

type Story = StoryObj<EaseMindModalProps>;

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
        <EaseMindButton
          label="Abrir Modal"
          color="primary"
          variant="contained"
          onClick={() => setOpen(true)}
        />
        <EaseMindModal
          title={args.title}
          open={open}
          onClose={() => setOpen(false)}
        >
          <p style={{ marginTop: 16, textAlign: 'center' }}>
            Aqui vai o conteúdo do modal.
          </p>
        </EaseMindModal>
      </>
    );
  },
};
