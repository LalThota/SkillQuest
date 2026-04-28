import mongoose, { Schema, Document } from 'mongoose';

export interface IAchievement extends Document {
  badgeId: string;
  name: string;
  description: string;
  icon: string;
  criteria: string;
}

const achievementSchema = new Schema<IAchievement>({
  badgeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  criteria: { type: String, required: true },
});

export const Achievement = mongoose.model<IAchievement>('Achievement', achievementSchema);
