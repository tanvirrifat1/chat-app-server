import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Product } from '../product/product.model';
import { IPayment } from './payment.interface';
import { stripe } from '../../../shared/stripe';
import Stripe from 'stripe';
import { Types } from 'mongoose';
import { Payment } from './payment.model';

const createCheckoutSession = async (payload: IPayment) => {
  const isExistProduct = await Product.findById(payload.product);

  if (!isExistProduct) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
  }

  const user = payload.user;
  const product = payload.product;

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
      success_url: `https://holybot.ai/success`,
      cancel_url: `https://holybot.ai/cancel`,
      metadata: {
        user,
        product,
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
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = session.metadata?.user;
        const productId = session.metadata?.product;

        if (!userId || !productId) {
          console.error('Missing metadata:', session.metadata);
          return;
        }

        const amountTotal = (session.amount_total ?? 0) / 100;

        const paymentRecord = new Payment({
          amount: amountTotal,
          user: new Types.ObjectId(userId),
          product: new Types.ObjectId(productId),
          email: session.customer_email || '',
          transactionId:
            typeof session.payment_intent === 'string'
              ? session.payment_intent
              : session.payment_intent?.id,
          status: 'success',
        });

        await paymentRecord.save();
        console.log('Payment saved successfully!');
        break;
      }

      case 'checkout.session.async_payment_failed': {
        const session = event.data.object as Stripe.Checkout.Session;

        const paymentIntentId =
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent?.id;

        let payment = await Payment.findOne({ transactionId: paymentIntentId });

        // If payment record doesn't exist yet, create a placeholder
        if (!payment) {
          payment = new Payment({
            transactionId: paymentIntentId,
            status: 'failed',
            amount: 0, // unknown
            user: session.metadata?.user
              ? new Types.ObjectId(session.metadata.user)
              : undefined,
            product: session.metadata?.product
              ? new Types.ObjectId(session.metadata.product)
              : undefined,
            email: session.customer_email || '',
          });
        } else {
          payment.status = 'failed';
        }

        await payment.save();
        console.log('Payment status updated to failed');
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error('Error handling Stripe webhook:', err);
  }
};
export const PaymentService = {
  createCheckoutSession,
  handleStripeWebhookService,
};
