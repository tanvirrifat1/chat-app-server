import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { ItemController } from './item.controller';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = Router();

router.post(
  '/create-item',
  fileUploadHandler,
  auth(USER_ROLES.USER),
  (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  ItemController.createItem,
);

router.get('/get-all-items', auth(USER_ROLES.USER), ItemController.getAllItems);

export const ItemRoutes = router;
