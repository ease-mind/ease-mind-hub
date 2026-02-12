import { model, Schema } from 'mongoose'

interface IFile {
    filename: string
    path: string,
    fileType: string,
    url: string,
    createdAt: string
}

const fileSchema = new Schema<IFile>({
    filename: { type: String, required: true },
    fileType: { type: String, required: true },
    path: { type: String, required: true },
    url: { type: String, required: true },
    createdAt: { type: String, required: true },
})

const File = model<IFile>('File', fileSchema)

export default File