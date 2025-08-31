import express from 'express';
import { ProductController } from './product.controller';

const router = express.Router();

router.post('/create', ProductController.createManyProducts);

router.get('/get-all-data', ProductController.getAllData);

export const ProductRoutes = router;
