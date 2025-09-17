import { model, Schema } from 'mongoose';
import { IWithdraw } from './withdraw.interface';

const withdrawSchema = new Schema<IWithdraw>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    amount: {
      type: Number,
      required: false,
    },
    status: {
      type: String,
      enum: ['request', 'paid', 'rejected'],
      default: 'request',
    },
    image: {
      type: String,
      required: false,
    },
    wallet: { type: Schema.Types.ObjectId, ref: 'Wallet', required: false },
  },
  { timestamps: true },
);

export const Withdraw = model<IWithdraw>('Withdraw', withdrawSchema);
