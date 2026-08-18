import mongoose, { Schema, Document } from 'mongoose';

export interface IInteraction extends Document {
  id: string;
  address: string;
  action: 'connect' | 'send_xlm' | 'fund_wallet' | 'contract_call' | 'disconnect';
  txHash?: string;
  details?: string;
  timestamp: string;
}

const InteractionSchema = new Schema<IInteraction>(
  {
    id: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    action: {
      type: String,
      enum: ['connect', 'send_xlm', 'fund_wallet', 'contract_call', 'disconnect'],
      required: true,
    },
    txHash: { type: String },
    details: { type: String },
    timestamp: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Interaction || mongoose.model<IInteraction>('Interaction', InteractionSchema);
