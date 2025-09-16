import { model, Schema } from 'mongoose';
import { IWallet } from './wallet.interface';

const walletSchema = new Schema<IWallet>(
  {
    balance: {
      type: Number,
      required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'refund'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

export const Wallet = model<IWallet>('Wallet', walletSchema);
