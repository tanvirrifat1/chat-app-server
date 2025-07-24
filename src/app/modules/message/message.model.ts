import { model, Schema } from 'mongoose';
import { IMsg } from './message.interface';

const messageSchema = new Schema<IMsg>(
  {
    inboxId: {
      type: Schema.Types.ObjectId,
      ref: 'Inbox',
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Message = model<IMsg>('Message', messageSchema);
