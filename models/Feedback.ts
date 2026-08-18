import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
  id: string;
  address: string;
  rating: number;
  comment: string;
  timestamp: string;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    id: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    timestamp: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);
