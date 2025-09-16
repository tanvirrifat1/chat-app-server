import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { WalletService } from './wallet.service';

const getMyWallet = catchAsync(async (req, res) => {
  const result = await WalletService.getMyWallet(req.user.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Wallet retrieved successfully',
    data: result,
  });
});

const getAllWallets = catchAsync(async (req, res) => {
  const result = await WalletService.getAllWallets(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Wallet retrieved successfully',
    data: result,
  });
});

export const WalletController = {
  getMyWallet,
  getAllWallets,
};
