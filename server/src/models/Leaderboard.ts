import mongoose, { Schema, Document } from 'mongoose';

export interface ILeaderboard extends Document {
  period: 'weekly' | 'monthly' | 'alltime';
  lastUpdated: Date;
  rankings: Array<{
    userId: mongoose.Types.ObjectId;
    xp: number;
    rank: number;
  }>;
}

const leaderboardSchema = new Schema<ILeaderboard>({
  period: { type: String, enum: ['weekly', 'monthly', 'alltime'], required: true, index: true },
  lastUpdated: { type: Date, default: Date.now },
  rankings: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    xp: { type: Number, required: true },
    rank: { type: Number, required: true }
  }]
});

export const Leaderboard = mongoose.model<ILeaderboard>('Leaderboard', leaderboardSchema);
