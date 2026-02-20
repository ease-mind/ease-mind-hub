import { model, Schema } from 'mongoose';

export interface ISymptom {
    id: string;
    label: string;
    category: 'communication' | 'physical' | 'stereotypies';
    description?: string;
    order?: number;
}

const symptomSchema = new Schema<ISymptom>({
    id: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    category: { 
        type: String, 
        required: true,
        enum: ['communication', 'physical', 'stereotypies']
    },
    description: { type: String, default: '' },
    order: { type: Number, default: 0 }
}, {
    timestamps: true
});

const Symptom = model<ISymptom>('Symptom', symptomSchema);

export default Symptom;
