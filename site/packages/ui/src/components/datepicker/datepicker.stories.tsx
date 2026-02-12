import { Meta, StoryObj } from '@storybook/react';
import { EaseMindDatePicker } from './datepicker';

const meta: Meta<typeof EaseMindDatePicker> = {
  title: 'Components/DatePicker',
  component: EaseMindDatePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EaseMindDatePicker>;

export const Default: Story = {
  render: (args) => <EaseMindDatePicker {...args} />,
  args: {
    label: 'Select a date',
  },
};

export const WithMinMaxDates: Story = {
  render: (args) => <EaseMindDatePicker {...args} />,
  args: {
    label: 'Select a date within range',
    minDate: new Date(new Date().setDate(new Date().getDate() - 5)),
    maxDate: new Date(new Date().setDate(new Date().getDate() + 5)),
  },
};

export const DisableFutureDates: Story = {
  render: (args) => <EaseMindDatePicker {...args} />,
  args: {
    label: 'Select a date (no future)',
    disableFuture: true,
  },
};

export const DisablePastDates: Story = {
  render: (args) => <EaseMindDatePicker {...args} />,
  args: {
    label: 'Select a date (no past)',
    disablePast: true,
  },
};

export const WithError: Story = {
  render: (args) => <EaseMindDatePicker {...args} />,
  args: {
    label: 'Date with error',
    error: true,
    helperText: 'Please select a valid date',
  },
};

export const Disabled: Story = {
  render: (args) => <EaseMindDatePicker {...args} />,
  args: {
    label: 'Disabled date picker',
    disabled: true,
  },
};

export const YearMonthOnly: Story = {
  render: (args) => <EaseMindDatePicker {...args} />,
  args: {
    label: 'Year and Month only',
    views: ['year', 'month'],
    format: 'MM/yyyy',
  },
};
