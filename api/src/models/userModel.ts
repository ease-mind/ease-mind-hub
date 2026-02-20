import { model, Schema } from 'mongoose'

interface IUser {
    name: string
    email: string
    password: string
    document: string
    image: string;
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
})

const User = model<IUser>('User', userSchema)

export default User