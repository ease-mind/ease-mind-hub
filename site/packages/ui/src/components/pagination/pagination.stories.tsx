import { StoryFn, Meta } from '@storybook/react';
import { EaseMindPagination, EaseMindPaginationProps } from './pagination';

export default {
  title: 'Components/Pagination',
  component: EaseMindPagination,
  argTypes: {
    totalPages: { control: 'number' },
    currentPage: { control: 'number' },
    onPageChange: { action: 'page changed' },
  },
} as Meta<typeof EaseMindPagination>;

const Template: StoryFn<typeof EaseMindPagination> = (args: EaseMindPaginationProps) => (
  <EaseMindPagination {...args} />
);

export const Default = Template.bind({});
Default.args = {
  totalPages: 10,
  currentPage: 1,
};
