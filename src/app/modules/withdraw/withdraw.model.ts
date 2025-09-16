import { model, Schema } from 'mongoose';
import { IWithdraw } from './withdraw.interface';

const withDrowSchema = new Schema<IWithdraw>(
  {
    amount: {
      type: Number,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

export const Withdraw = model<IWithdraw>('Withdraw', withDrowSchema);
