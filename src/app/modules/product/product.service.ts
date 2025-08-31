import { IProduct } from './product.interface';
import { Product } from './product.model';

const createManyProducts = async (products: IProduct[]) => {
  return await Product.insertMany(products);
};

export const ProductService = {
  createManyProducts,
};
