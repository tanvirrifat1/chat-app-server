import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { MessageService } from './message.service';

const getAllMessages = catchAsync(async (req, res) => {
  const result = await MessageService.getAllMessages(req.params.id, req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Messages retrieved successfully',
    data: result,
  });
});

export const MessageController = {
  getAllMessages,
};
