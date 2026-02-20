import { Schema, model, Document } from 'mongoose';

export interface IUserSymptom extends Document {
  userId: string;
  selectedSymptoms: string[];
  temperature: number;
  level: string;
  timestamp: Date;
  categoryCount: {
    communication: number;
    physical: number;
    stereotypies: number;
  };
}

const userSymptomSchema = new Schema<IUserSymptom>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  selectedSymptoms: {
    type: [String],
    required: true,
  },
  temperature: {
    type: Number,
    required: true,
  },
  level: {
    type: String,
    required: true,
    enum: ['Calmo', 'Alerta', 'Sobrecarga', 'Neutro'],
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
  categoryCount: {
    communication: {
      type: Number,
      default: 0,
    },
    physical: {
      type: Number,
      default: 0,
    },
    stereotypies: {
      type: Number,
      default: 0,
    },
  },
}, {
  timestamps: true,
});

userSymptomSchema.index({ userId: 1, timestamp: -1 });

const UserSymptom = model<IUserSymptom>('UserSymptom', userSymptomSchema);

export default UserSymptom;
