import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Product } from '../product/product.model';
import { IPayment } from './payment.interface';
import { stripe } from '../../../shared/stripe';

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

export const PaymentService = {
  createCheckoutSession,
};
