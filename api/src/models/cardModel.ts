import { model, Schema } from 'mongoose'
import { CardFlag } from '../enums/cardFlag.enum'

interface ICard {
    userId: string
    cardNumber: number
    name: string
    functions: [string]
    variant: string
    expirationDate: Date
    cvv: number
    flag: CardFlag
    limit: number
    blocked: boolean
}

const cardSchema = new Schema<ICard>({
    userId: { type: String, required: true },
    cardNumber: { type: Number, required: true },
    name: { type: String, required: true },
    functions: { type: [String], required: true, enum: ['credit', 'debit'] },
    variant: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    cvv : { type: Number, required: true },
    flag: { type: String, required: true, enum: Object.values(CardFlag) },
    limit: { type: Number, required: true },
    blocked: { type: Boolean }
})

const Card = model<ICard>('Card', cardSchema)

export default Card