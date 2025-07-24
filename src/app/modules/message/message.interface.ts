import { Types } from 'mongoose';

export type IMsg = {
  senderId: Types.ObjectId;
  inboxId: Types.ObjectId;
  message: string;
};
