import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { InboxService } from './inbox.service';

const createInbox = catchAsync(async (req, res) => {
  const { receiverId } = req.params;

  const senderId = req.user.id;

  const payload = {
    ...req.body,
    senderId,
    receiverId,
  };

  const result = await InboxService.createInbox(payload);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Inbox created successfully',
    data: result,
  });
});

const getAllInboxFromDb = catchAsync(async (req, res) => {
  const result = await InboxService.getAllInboxFromDb(req.user.id, req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Inbox created successfully',
    data: result,
  });
});

export const InboxController = {
  createInbox,
  getAllInboxFromDb,
};
