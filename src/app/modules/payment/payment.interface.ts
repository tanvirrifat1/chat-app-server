import { Types } from 'mongoose';

export type IPayment = {
  amount: number;
  user: Types.ObjectId;
  product: Types.ObjectId;
  transactionId: string;
  email: string;
  status: 'success' | 'failed';
  percentage: string;
};
