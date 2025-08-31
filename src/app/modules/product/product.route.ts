import express from 'express';
import { ProductController } from './product.controller';

const router = express.Router();

router.post('/create', ProductController.createManyProducts);

export const ProductRoutes = router;
