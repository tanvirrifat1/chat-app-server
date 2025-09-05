import { Types } from 'mongoose';
import catchAsync from '../../../shared/catchAsync';
import { PaymentService } from './payment.service';

const createCheckoutSession = catchAsync(async (req, res) => {
  const user = req.user.id;
  const email = req.user.email;
  const product = req.body.product;

  const value: any = {
    user,
    product,
    email,
  };

  try {
    const sessionUrl = await PaymentService.createCheckoutSession(value);
    res.status(200).json({ url: sessionUrl });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create checkout session' });
  }
});

export const PaymentController = {
  createCheckoutSession,
};
