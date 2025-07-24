import express from 'express';
import { InboxController } from './inbox.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post(
  '/send-message/:receiverId',
  auth(USER_ROLES.USER),
  InboxController.createInbox,
);

router.get(
  '/get-inbox',
  auth(USER_ROLES.USER),
  InboxController.getAllInboxFromDb,
);

export const InboxRoutes = router;
