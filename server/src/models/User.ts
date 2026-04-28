import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  avatar?: string;
  xp: number;
  level: number;
  streak: {
    current: number;
    longest: number;
    lastActiveDate: Date | null;
  };
  badges: Array<{ badgeId: string; unlockedAt: Date }>;
  totalQuizzes: number;
  totalCorrect: number;
  totalQuestions: number;
  categoryStats: {
    aptitude: { attempted: number; correct: number; avgTime: number };
    reasoning: { attempted: number; correct: number; avgTime: number };
    verbal: { attempted: number; correct: number; avgTime: number };
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true, trim: true, index: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  avatar: { type: String, default: '😊' },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: null },
  },
  badges: [{
    badgeId: { type: String, required: true },
    unlockedAt: { type: Date, default: Date.now }
  }],
  totalQuizzes: { type: Number, default: 0 },
  totalCorrect: { type: Number, default: 0 },
  totalQuestions: { type: Number, default: 0 },
  categoryStats: {
    aptitude: { attempted: { type: Number, default: 0 }, correct: { type: Number, default: 0 }, avgTime: { type: Number, default: 0 } },
    reasoning: { attempted: { type: Number, default: 0 }, correct: { type: Number, default: 0 }, avgTime: { type: Number, default: 0 } },
    verbal: { attempted: { type: Number, default: 0 }, correct: { type: Number, default: 0 }, avgTime: { type: Number, default: 0 } }
  }
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', userSchema);
