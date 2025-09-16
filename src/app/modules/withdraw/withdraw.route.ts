import { Router } from 'express';
import { WithdrawController } from './withdraw.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = Router();

router.get(
  '/get-my-withdraw',
  auth(USER_ROLES.USER),
  WithdrawController.getMyWallet,
);

export const WithdrawRoutes = router;
