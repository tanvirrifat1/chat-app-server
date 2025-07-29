import express from 'express';

import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { MessageController } from './message.controller';

const router = express.Router();

router.get(
  '/get-message/:id',
  // auth(USER_ROLES.USER),
  MessageController.getAllMessages,
);

export const MessageRoutes = router;
