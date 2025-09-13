import express from 'express';
import { PaymentController } from './payment.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

//webhook
router.post(
  '/create-checkout-session',
  auth(USER_ROLES.USER),
  PaymentController.createCheckoutSession,
);

router.get(
  '/get-payment-by-user',
  auth(USER_ROLES.USER),
  PaymentController.getPaymentByUser,
);

export const PaymentRoutes = router;
