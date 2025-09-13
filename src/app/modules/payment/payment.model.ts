import { model, Schema } from 'mongoose';
import { IPayment } from './payment.interface';

const paymentSchema = new Schema<IPayment>(
  {
    amount: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['success', 'failed'],
    },
    percentage: {
      type: String,
    },
  },
  { timestamps: true },
);

export const Payment = model<IPayment>('Payment', paymentSchema);
