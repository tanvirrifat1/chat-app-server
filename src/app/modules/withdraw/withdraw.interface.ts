import { Types } from 'mongoose';

export type IWithdraw = {
  user: Types.ObjectId;
  amount: number;
  status: string;
  image: string;
};
