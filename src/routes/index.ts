import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { NotificationRoutes } from '../app/modules/notification/notification.route';
import { InboxRoutes } from '../app/modules/inbox/inbox.route';
import { MessageRoutes } from '../app/modules/message/message.route';
import { ProductRoutes } from '../app/modules/product/product.route';
import { PaymentRoutes } from '../app/modules/payment/payment.route';
import { WithdrawRoutes } from '../app/modules/withdraw/withdraw.route';

const router = express.Router();

const apiRoutes = [
  { path: '/user', route: UserRoutes },
  { path: '/auth', route: AuthRoutes },
  { path: '/notification', route: NotificationRoutes },
  { path: '/inbox', route: InboxRoutes },
  { path: '/message', route: MessageRoutes },
  { path: '/product', route: ProductRoutes },
  { path: '/payment', route: PaymentRoutes },
  { path: '/withdraw', route: WithdrawRoutes },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
