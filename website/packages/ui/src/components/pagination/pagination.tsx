import React from 'react';
import Pagination, { PaginationProps } from '@mui/material/Pagination';

export interface EaseMindPaginationProps extends PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
}

export const EaseMindPagination = ({
  totalPages,
  currentPage,
  onPageChange,
  ...props
}: EaseMindPaginationProps) => {
  return (
    <Pagination
      {...props}
      count={totalPages}
      page={currentPage}
      onChange={onPageChange}
      shape="rounded"
    />
  );
}
