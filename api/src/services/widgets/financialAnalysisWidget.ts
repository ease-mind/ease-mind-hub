import mongoose from 'mongoose'
import Transaction from '../../models/transactionModel'
import Category from '../../models/categoryModel'

export const financialAnalysisWidget = async (userId: string) => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const transactions = await Transaction.find({
        userId: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: startOfMonth, $lte: now }
    }).lean()

    let income = 0
    let expense = 0
    const categoryTotals: { [categoryId: string]: number } = {}

    for (const t of transactions) {
        if (t.type === 'income') {
            income += t.value
        } else if (t.type === 'expense') {
            expense += t.value
            const categoryId = t.categoryId?.toString()
            if (categoryId) categoryTotals[categoryId] = (categoryTotals[categoryId] || 0) + t.value
        }
    }

    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])
    const categoryId = sortedCategories[0]?.[0]

    let category = null

    if (categoryId) {
        const categorySelected = await Category.findById(categoryId).lean()
        if (categorySelected) {
            const percentage = expense > 0 ? ((expense / (income + expense)) * 100).toFixed(2) : 0
            category = { name: categorySelected.name, percentage }
        }
    }
    const response = (income && expense && category) ? {
        income,
        expense,
        category
    }: null;
    return response;
}