import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Product } from '../product/product.model';
import { IPayment } from './payment.interface';
import { stripe } from '../../../shared/stripe';
import { Payment } from './payment.model';
import Stripe from 'stripe';
import { Types } from 'mongoose';

const createCheckoutSession = async (payload: IPayment) => {
  const isExistProduct = await Product.findById(payload.product);

  if (!isExistProduct) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
  }

  const user = payload.user;

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: isExistProduct.name,
            },
            unit_amount: isExistProduct.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: payload.email,
      success_url: `https://holybot.ai`,
      cancel_url: `https://holybot.ai`,
      metadata: {
        user,
        product: isExistProduct._id,
      } as any,
    });

    return session.url;
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Something went wrong',
    );
  }
};

const handleStripeWebhookService = async (event: Stripe.Event) => {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      const { amount_total, metadata, payment_intent, status } = session;
      const userId = metadata?.user as string;
      const product = metadata?.product;
      const email = session.customer_email || '';

      const amountTotal = (amount_total ?? 0) / 100;

      const paymentRecord = new Payment({
        amount: amountTotal,
        user: new Types.ObjectId(userId),
        product: new Types.ObjectId(product),
        email,
        transactionId: payment_intent,
        status,
      });

      await paymentRecord.save();
      break;
    }

    case 'checkout.session.async_payment_failed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const { payment_intent } = session;
      console.log(payment_intent);
      const payment = await Payment.findOne({ transactionId: payment_intent });
      if (payment) {
        payment.status = 'failed';
        await payment.save();
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
};

export const PaymentService = {
  createCheckoutSession,
  handleStripeWebhookService,
};
