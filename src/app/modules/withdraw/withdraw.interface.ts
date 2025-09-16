import { Types } from 'mongoose';

export type IWithdraw = {
  user: Types.ObjectId;
  amount: number;
  status: 'pending' | 'paid' | 'rejected';
};
