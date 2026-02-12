import { model, Schema } from 'mongoose'
import { WidgetKey } from '../enums/widgets.enum'

interface IUser {
    name: string
    email: string
    password: string
    document: string
    image: string;
    selectedWidgets: WidgetKey[]
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    document: { type: String, unique: true, default: null },
    image: {
        type: String,
        default: ''
    },
    selectedWidgets: {
        type: [String],
        enum: Object.values(WidgetKey),
        default: Object.values(WidgetKey),
    },
})

const User = model<IUser>('User', userSchema)

export default User