import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ChatService } from './chat.service';

const generateText = catchAsync(async (req, res) => {
  const { prompt } = req.body; // Extract prompt from body
  const result = await ChatService.generateText(prompt);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Chat generated successfully',
    data: result,
  });
});
export const ChatController = {
  generateText,
};
