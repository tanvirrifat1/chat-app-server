import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { WalletController } from './wallet.controller';

const router = Router();

router.get('/my-wallet', auth(USER_ROLES.USER), WalletController.getMyWallet);

router.get(
  '/all-wallet',
  auth(USER_ROLES.ADMIN),
  WalletController.getAllWallets,
);

export const WalletRoutes = router;
