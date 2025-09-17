import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { WithdrawService } from './withdraw.service';

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

export const WithdrawController = {
  requestWithdraw,
};
