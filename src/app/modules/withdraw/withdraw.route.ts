import { NextFunction, Request, Response, Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { WithdrawController } from './withdraw.controller';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { withdrawSchema } from './withdraw.validation';

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

router.patch(
  '/paid-withdraw/:id',
  fileUploadHandler,
  auth(USER_ROLES.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = withdrawSchema.parse(JSON.parse(req.body.data));
    }
    return WithdrawController.paidWithdraw(req, res, next);
  },
);

export const WithdrawRoutes = router;
