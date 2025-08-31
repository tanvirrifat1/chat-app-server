import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ProductService } from './product.service';

const createManyProducts = catchAsync(async (req, res) => {
  const products = req.body;
  const result = await ProductService.createManyProducts(products);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Products created successfully',
    data: result,
  });
});

const getAllData = catchAsync(async (req, res) => {
  const result = await ProductService.getAllData(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Products retrieved successfully',
    data: result,
  });
});

export const ProductController = {
  createManyProducts,
  getAllData,
};
