import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: 'aptitude' | 'reasoning' | 'verbal' | 'coding' | 'data_interpretation';
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
}

const questionSchema = new Schema<IQuestion>({
  text: { type: String, required: true },
  options: { type: [String], required: true, validate: [arrayLimit, 'Options must be exactly 4'], },
  correctIndex: { type: Number, required: true, min: 0, max: 3 },
  explanation: { type: String, required: true },
  category: { type: String, enum: ['aptitude', 'reasoning', 'verbal', 'coding', 'data_interpretation'], required: true, index: true },
  topic: { type: String, required: true, index: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  timeLimit: { type: Number, required: true }
}, { timestamps: true });

function arrayLimit(val: string[]) {
  return val.length === 4;
}

export const Question = mongoose.model<IQuestion>('Question', questionSchema);
