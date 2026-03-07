import type { Meta, StoryObj } from '@storybook/react-vite';
import { EasemindHeader } from './header';

const meta = {
  title: 'Components/Header',
  component: EasemindHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof EasemindHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {};
