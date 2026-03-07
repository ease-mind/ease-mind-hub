import React from 'react';
import Pagination, { PaginationProps } from '@mui/material/Pagination';

export interface EasemindPaginationProps extends PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
}

export const EasemindPagination = ({
  totalPages,
  currentPage,
  onPageChange,
  ...props
}: EasemindPaginationProps) => {
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
