import { Types } from 'mongoose';

export type IItems = {
  name: string;
  description: string;
  price: number;
  category: string;
  userId: Types.ObjectId;
  image: string;
};
