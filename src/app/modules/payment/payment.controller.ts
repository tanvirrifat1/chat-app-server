import { Types } from 'mongoose';
import catchAsync from '../../../shared/catchAsync';
import { PaymentService } from './payment.service';
import { stripe } from '../../../shared/stripe';
import config from '../../../config';
import { Request, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

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

const handleStripeWebhookService = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig! as string,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    await PaymentService.handleStripeWebhookService(event);

    res.status(200).send({ received: true });
  } catch (err: any) {
    res.status(400).send(`Webhook Error:${err.message}`);
  }
};

const getPaymentByUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const payments = await PaymentService.getPaymentByUser(userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Payments retrieved successfully',
    data: payments,
  });
});

const getAllPayments = catchAsync(async (req: Request, res: Response) => {
  const payments = await PaymentService.getAllPayments(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Payments retrieved successfully',
    data: payments,
  });
});

export const PaymentController = {
  createCheckoutSession,
  handleStripeWebhookService,
  getPaymentByUser,
  getAllPayments,
};
