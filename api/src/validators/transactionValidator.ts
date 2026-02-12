import mongoose from 'mongoose'
import { TransactionType } from '../enums/transactionType.enum'
import Method from '../models/methodsModel'
import Category from '../models/categoryModel'


interface ValidateTransactionOptions {
    methodId: string
    categoryId: string
    type: TransactionType
}

export const validateTransactionConsistency = async ({
    methodId,
    categoryId,
    type
}: ValidateTransactionOptions): Promise<{ valid: boolean; message?: string }> => {
    if (!mongoose.Types.ObjectId.isValid(methodId)) {
        return { valid: false, message: 'ID do método de pagamento inválido.' }
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return { valid: false, message: 'ID da categoria inválido.' }
    }

    const [method, category] = await Promise.all([
        Method.findById(methodId).lean(),
        Category.findById(categoryId).lean()
    ])

    if (!method) {
        return { valid: false, message: 'Método de pagamento não encontrado.' }
    }

    if (!category) {
        return { valid: false, message: 'Categoria não encontrada.' }
    }

    if (method.type !== type) {
        return {
            valid: false,
            message: `O método de pagamento (${method.name}) não é compatível com o tipo da transação (${type}).`
        }
    }

    if (category.type !== type) {
        return {
            valid: false,
            message: `A categoria (${category.name}) não é compatível com o tipo da transação (${type}).`
        }
    }

    return { valid: true }
}