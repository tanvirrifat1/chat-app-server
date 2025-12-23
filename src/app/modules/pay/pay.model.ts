import { model, Schema } from 'mongoose';
import { IPay } from './pay.interface';

const paySchema = new Schema<IPay>(
  {
    amount: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sellerAccountId: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: String, enum: ['success', 'failed'] },
    percentage: { type: String },
  },
  { timestamps: true },
);

export const Pay = model<IPay>('Pay', paySchema);
