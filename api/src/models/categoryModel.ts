import { model, Schema } from 'mongoose'
import { TransactionType } from '../enums/transactionType.enum'

interface ICategory {
    name: string
    type: TransactionType
}

const categorySchema = new Schema<ICategory>({
    name: { type: String, required: true },
    type: { type: String, required: true, enum: Object.values(TransactionType) },
})

const Category = model<ICategory>('Category', categorySchema)

export default Category