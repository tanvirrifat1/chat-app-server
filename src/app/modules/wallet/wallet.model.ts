import { model, Schema } from 'mongoose';
import { IWallet } from './wallet.interface';

const walletSchema = new Schema<IWallet>(
  {
    balance: {
      type: Number,
      required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

export const Wallet = model<IWallet>('Wallet', walletSchema);
