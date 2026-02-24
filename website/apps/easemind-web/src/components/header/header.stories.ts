import type { Meta, StoryObj } from '@storybook/react-vite';
import { EaseMindHeader } from './header';

const meta = {
  title: 'Components/Header',
  component: EaseMindHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof EaseMindHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {};
