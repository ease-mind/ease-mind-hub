import Transaction from '../models/transactionModel'

interface TransactionFilter {
    userId: string
    limit: number
    page: number
    type?: string
    minValue?: number
    maxValue?: number
    startDate?: Date
    endDate?: Date
    methodId?: string
    categoryId?: string
}

export const getFilteredTransactions = async (filters: TransactionFilter) => {
    const query: any = {}

    if (filters.userId) query.userId = filters.userId
    if (filters.type) query.type = filters.type
    if (filters.minValue || filters.maxValue) {
        query.value = {}
        if (filters.minValue) query.value.$gte = filters.minValue
        if (filters.maxValue) query.value.$lte = filters.maxValue
    }

    if (filters.startDate || filters.endDate) {
        query.createdAt = {}
        if (filters.startDate) query.createdAt.$gte = filters.startDate
        if (filters.endDate) {
            const end = new Date(filters.endDate)
            end.setHours(23, 59, 59, 999)
            query.createdAt.$lte = end
        }
    }

    if (filters.methodId) {
        query.methodId = filters.methodId
    }

    if (filters.categoryId) {
        query.categoryId = filters.categoryId
    }

    const skip = (filters.page - 1) * filters.limit

    const [data, total] = await Promise.all([
        Transaction.find(query).skip(skip).limit(filters.limit).lean(),
        Transaction.countDocuments(query)
    ])

    return {
        data,
        pagination: {
            total,
            page: filters.page,
            limit: filters.limit,
            totalPages: Math.ceil(total / filters.limit)
        }
    }
}