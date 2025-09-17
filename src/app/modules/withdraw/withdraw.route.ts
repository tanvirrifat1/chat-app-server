import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { WithdrawController } from './withdraw.controller';

const router = Router();

router.post(
  '/request-withdraw',
  auth(USER_ROLES.USER),
  WithdrawController.requestWithdraw,
);

router.get(
  '/admin-withdraw-requests',
  auth(USER_ROLES.ADMIN),
  WithdrawController.getAllWithdrawRequests,
);

export const WithdrawRoutes = router;
