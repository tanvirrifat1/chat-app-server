import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { WithdrawService } from './withdraw.service';

const getMyWallet = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await WithdrawService.getMyWallet(userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Withdrawal history retrieved successfully',
    data: result,
  });
});

const getMyWalletPaid = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await WithdrawService.getMyWalletPaid(userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Withdrawal history retrieved successfully',
    data: result,
  });
});

const getAllWallet = catchAsync(async (req, res) => {
  const result = await WithdrawService.getAllWallet(req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Withdrawal history retrieved successfully',
    data: result,
  });
});

export const WithdrawController = {
  getMyWallet,
  getMyWalletPaid,
  getAllWallet,
};
