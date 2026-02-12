import mongoose, { model, Schema } from 'mongoose'

interface IAddress {
    userId: mongoose.Types.ObjectId
    address: string
    city: string
    state: string
    code: number
    complement: string
}

const addressSchema = new Schema<IAddress>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    code: { type: Number, default: null },
    complement: { type: String, default: '' },
})

const Address = model<IAddress>('Address', addressSchema)

export default Address