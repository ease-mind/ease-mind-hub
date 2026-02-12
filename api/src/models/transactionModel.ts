import { model, Schema } from 'mongoose'
import { TransactionType } from '../enums/transactionType.enum'

interface ITransaction {
    userId: string
    type: TransactionType
    value: number
    createdAt: Date
    categoryId: string
    methodId: string
    cardId?: string
    fileId?: string
}

const transactionSchema = new Schema<ITransaction>({
    userId: { type: String, required: true },
    type: { type: String, required: true, enum: Object.values(TransactionType) },
    value : { type: Number, required: true },
    createdAt: { type: Date, required: true },
    categoryId: { type: String, required: true },
    methodId: { type: String, required: true },
    cardId: { type: String, required: false },
    fileId: { type: String, required: false },
})

const Transaction = model<ITransaction>('Transaction', transactionSchema)

export default Transaction
