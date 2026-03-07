import { StoryFn, Meta } from '@storybook/react';
import { EasemindPagination, EasemindPaginationProps } from './pagination';

export default {
  title: 'Components/Pagination',
  component: EasemindPagination,
  argTypes: {
    totalPages: { control: 'number' },
    currentPage: { control: 'number' },
    onPageChange: { action: 'page changed' },
  },
} as Meta<typeof EasemindPagination>;

const Template: StoryFn<typeof EasemindPagination> = (args: EasemindPaginationProps) => (
  <EasemindPagination {...args} />
);

export const Default = Template.bind({});
Default.args = {
  totalPages: 10,
  currentPage: 1,
};
