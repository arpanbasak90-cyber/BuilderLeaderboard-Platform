import mongoose, { Schema, Document } from 'mongoose';

export interface IQuest extends Document {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  xlmReward: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Smart Contract' | 'DeFi' | 'NFT' | 'Governance' | 'Community' | 'Mainnet Launch';
  completedBy: number;
  totalSlots: number;
  isActive: boolean;
}

const QuestSchema = new Schema<IQuest>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    xpReward: { type: Number, required: true },
    xlmReward: { type: Number, required: true },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    category: {
      type: String,
      enum: ['Smart Contract', 'DeFi', 'NFT', 'Governance', 'Community', 'Mainnet Launch'],
      default: 'Smart Contract',
    },
    completedBy: { type: Number, default: 0 },
    totalSlots: { type: Number, default: 100 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Quest || mongoose.model<IQuest>('Quest', QuestSchema);
