import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { WithdrawService } from './withdraw.service';
import { getFilePathMultiple } from '../../../shared/getFilePath';

const requestWithdraw = catchAsync(async (req, res) => {
  const user = req.user.id;

  const value = {
    ...req.body,
    user,
  };

  const result = await WithdrawService.requestWithdraw(value);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Withdraw request sent successfully',
    data: result,
  });
});

const getAllWithdrawRequests = catchAsync(async (req, res) => {
  const result = await WithdrawService.getAllWithdrawRequests(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Withdraw requests retrieved successfully',
    data: result,
  });
});

const paidWithdraw = catchAsync(async (req, res) => {
  const value = {
    ...req.body,
  };

  let image = getFilePathMultiple(req.files, 'image', 'image');

  if (image && image.length > 0) {
    value.image = image[0];
  }

  const result = await WithdrawService.paidWithdraw(req.params.id, value);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Withdraw requests retrieved successfully',
    data: result,
  });
});

export const WithdrawController = {
  requestWithdraw,
  getAllWithdrawRequests,
  paidWithdraw,
};
