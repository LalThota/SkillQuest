import mongoose, { Schema, Document } from 'mongoose';

export interface IQuiz extends Document {
  userId: mongoose.Types.ObjectId;
  mode: 'quick' | 'full' | 'topic';
  category: string;
  topic?: string;
  questions: Array<{
    questionId: mongoose.Types.ObjectId;
    selectedIndex: number;
    isCorrect: boolean;
    timeTaken: number;
  }>;
  score: number;
  xpEarned: number;
  accuracy: number;
  completedAt: Date;
}

const quizSchema = new Schema<IQuiz>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  mode: { type: String, enum: ['quick', 'full', 'topic'], required: true },
  category: { type: String, required: true },
  topic: { type: String },
  questions: [{
    questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    selectedIndex: { type: Number, required: true },
    isCorrect: { type: Boolean, required: true },
    timeTaken: { type: Number, required: true }
  }],
  score: { type: Number, required: true },
  xpEarned: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const Quiz = mongoose.model<IQuiz>('Quiz', quizSchema);
