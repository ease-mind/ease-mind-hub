import { Transaction } from './transaction';

export interface ExtractProps {
    pagination: Pagination;
    data: Transaction[];
}

export interface Extract {
    mounth: string;
    data: Transaction[];
}

export interface Pagination{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ExtractFilter {
    page?: number
    limit?: number
    categoryId?: string
    minValue?: number | string
    maxValue?: number | string
    startDate?: string
    endDate?: string
}
    