import { model, Schema } from 'mongoose'
import { TransactionType } from '../enums/transactionType.enum'

interface IMethod {
    name: string
    type: TransactionType
}

const methodSchema = new Schema<IMethod>({
    name: { type: String, required: true },
    type: { type: String, required: true, enum: Object.values(TransactionType) },
})

const Method = model<IMethod>('Method', methodSchema)

export default Method