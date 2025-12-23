import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { PayController } from './pay.controller';

const router = express.Router();

router.post(
  '/create-split-payment-intent',
  auth(USER_ROLES.USER),
  PayController.createSplitPaymentIntent,
);

export const PayRoutes = router;
