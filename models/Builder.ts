import mongoose, { Schema, Document } from 'mongoose';

export interface IBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt: string;
}

export interface IBuilder extends Document {
  id: string;
  name: string;
  avatar: string;
  stellarAddress: string;
  xp: number;
  level: number;
  xlmEarned: number;
  questsCompleted: number;
  badges: IBadge[];
  rank: number;
  weeklyXPGain: number;
  onChainTxCount: number;
  joinedAt: string;
}

const BadgeSchema = new Schema<IBadge>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  icon: { type: String, required: true },
  description: { type: String, required: true },
  earnedAt: { type: String, required: true },
});

const BuilderSchema = new Schema<IBuilder>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    avatar: { type: String, required: true },
    stellarAddress: { type: String, required: true, unique: true },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    xlmEarned: { type: Number, default: 0 },
    questsCompleted: { type: Number, default: 0 },
    badges: [BadgeSchema],
    rank: { type: Number, default: 99 },
    weeklyXPGain: { type: Number, default: 0 },
    onChainTxCount: { type: Number, default: 0 },
    joinedAt: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Builder || mongoose.model<IBuilder>('Builder', BuilderSchema);
