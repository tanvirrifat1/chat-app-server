import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ItemService } from './item.service';
import { getFilePathMultiple } from '../../../shared/getFilePath';
import { IItems } from './item.interface';

const createItem = catchAsync(async (req, res) => {
  const userId = req.user.id;

  // Prepare payload with correct userId
  const value: Partial<IItems> = {
    ...req.body,
    userId, // ✅ correct field name
  };

  // Handle image upload
  const image = getFilePathMultiple(req.files, 'image', 'image');

  if (image && image.length > 0) {
    value.image = image[0];
  }

  // ✅ Pass value instead of req.body
  const result = await ItemService.createItem(value as IItems);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Item created successfully',
    data: result,
  });
});

const getAllItems = catchAsync(async (req, res) => {
  const result = await ItemService.getAllItems(req.query, req.user.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Items retrieved successfully',
    data: result,
  });
});

export const ItemController = {
  createItem,
  getAllItems,
};
