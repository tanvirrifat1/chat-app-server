import { Types } from 'mongoose';

export type IWallet = {
  user: Types.ObjectId;
  balance: number;
};
