import { Types } from 'mongoose';

export type IPay = {
  amount: number;
  user: Types.ObjectId;
  sellerAccountId: string;
  email: string;
  status: 'success' | 'failed';
  percentage: string;
};
