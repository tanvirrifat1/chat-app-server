import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Product } from '../product/product.model';
import { IPayment } from './payment.interface';
import { stripe } from '../../../shared/stripe';
import Stripe from 'stripe';
import { Types } from 'mongoose';
import { Payment } from './payment.model';
import { Withdraw } from '../withdraw/withdraw.model';
import { logger } from '../../../shared/logger';
import { green, yellow } from 'colors';

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
      success_url: `https://rifat-full-stack-portfolio.vercel.app`,
      cancel_url: `https://rifat-full-stack-portfolio.vercel.app`,
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
        const userPercentage = 0.8; // 80%
        const userEarning = amountTotal * userPercentage;

        const paymentRecord = new Payment({
          amount: amountTotal,
          user: new Types.ObjectId(userId),
          percentage: userEarning.toString(),
          product: new Types.ObjectId(productId),
          email: session.customer_email || '',
          transactionId:
            typeof session.payment_intent === 'string'
              ? session.payment_intent
              : session.payment_intent?.id,
          status: 'success',
        });

        if (paymentRecord.status === 'success') {
          await Withdraw.create({
            user: new Types.ObjectId(userId),
            amount: userEarning,
          });
        }
        await paymentRecord.save();
        // console.log('Payment saved successfully!');
        logger.info(green('Payment saved successfully!'));
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
            percentage: '0',
          });
        } else {
          payment.status = 'failed';
        }

        await payment.save();
        console.log('Payment status updated to failed');
        logger.info(yellow('Payment status updated to failed'));
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error('Error handling Stripe webhook:', err);
  }
};

const getPaymentByUser = async (userId: string) => {
  const payments = await Payment.find({ user: userId, status: 'success' });
  const total = payments.reduce(
    (sum, p) => sum + parseFloat(p.percentage as string),
    0,
  );
  return total;
};

const getAllPayments = async (query: Record<string, unknown>) => {
  const { page, limit, searchTerm, ...filterData } = query;
  const conditions: any[] = [{ status: 'success' }];

  // Add filter conditions
  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({
        [field]: value,
      }),
    );
    conditions.push({ $and: filterConditions });
  }

  const whereConditions = conditions.length ? { $and: conditions } : {};

  // Pagination setup
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  // Set default sort order to show new data first
  const result = await Payment.find(whereConditions)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .populate({
      path: 'user',
      select: 'name email',
    })
    .populate('product')
    .lean<IPayment[]>(); // Assert type
  const total = await Payment.countDocuments(whereConditions);

  return {
    result,
    page: pages,
    limit: size,
    total,
  };
};

export const PaymentService = {
  createCheckoutSession,
  handleStripeWebhookService,
  getPaymentByUser,
  getAllPayments,
};
