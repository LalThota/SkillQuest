import mongoose, { Schema, Document } from 'mongoose';

export interface IGameSession extends Document {
  userId: mongoose.Types.ObjectId;
  categoryId: string;
  puzzlesAttempted: number;
  puzzlesCorrect: number;
  livesLost: number;
  finalScore: number;
  accuracy: number;
  timeElapsed: number;
  xpEarned: number;
  starRating: number;
  completedAt: Date;
}

const gameSessionSchema = new Schema<IGameSession>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  categoryId: { type: String, required: true },
  puzzlesAttempted: { type: Number, required: true },
  puzzlesCorrect: { type: Number, required: true },
  livesLost: { type: Number, default: 0 },
  finalScore: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  timeElapsed: { type: Number, required: true },
  xpEarned: { type: Number, default: 0 },
  starRating: { type: Number, default: 1 },
  completedAt: { type: Date, default: Date.now },
});

export const GameSession = mongoose.model<IGameSession>('GameSession', gameSessionSchema);
