import { stripe } from '../../../shared/stripe';

interface PaymentIntentPayload {
  amount: number; // Total amount (in USD)
  sellerAccountId: string; // Connected account ID
  customerEmail: string;
}

const createSplitPaymentIntent = async (payload: PaymentIntentPayload) => {
  const { amount, sellerAccountId, customerEmail } = payload;

  const applicationFee = amount * 0.1; // 10% fee for admin
  const sellerAmount = amount - applicationFee;

  // Stripe expects amount in cents
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: 'usd',
    receipt_email: customerEmail,
    automatic_payment_methods: { enabled: true },

    // 👇 This is the magic: Split payment
    transfer_data: {
      destination: sellerAccountId, // Send remaining to seller
    },
    application_fee_amount: Math.round(applicationFee * 100), // Admin keeps 10%
  });

  return paymentIntent;
};

export const PayService = {
  createSplitPaymentIntent,
};
