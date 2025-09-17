import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import { IWithdraw } from './withdraw.interface';
import { sendNotifications } from '../../../helpers/notificationHelper';
import { Notification } from '../notification/notification.model';
import { Withdraw } from './withdraw.model';
import { Wallet } from '../wallet/wallet.model';

const requestWithdraw = async (data: IWithdraw) => {
  const [isUser, myWallet, isExistRequest] = await Promise.all([
    User.findById(data.user),
    Wallet.findOne({ user: data.user }),
    Withdraw.findOne({ user: data.user, status: 'request' }),
  ]);

  if (!isUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  if (isExistRequest) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'You already have a pending withdraw request',
    );
  }

  if (!myWallet || myWallet.balance < data.amount) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Insufficient balance');
  }

  // Notification handling (run in parallel, no need to block)
  const notificationPayload = {
    title: 'You have withdraw request',
    text: `You have a withdraw request from ${isUser.name}`,
    type: 'ADMIN',
  };

  void sendNotifications(notificationPayload);
  void Notification.create(notificationPayload);

  data.wallet = myWallet._id;

  return Withdraw.create(data);
};

const getAllWithdrawRequests = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};
  if (query.status) filter.status = query.status;

  const [result, total] = await Promise.all([
    Withdraw.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'user',
        select: 'name email phone image',
      }),
    Withdraw.countDocuments(filter),
  ]);

  return {
    result,
    page,
    limit,
    total,
  };
};

const paidWithdraw = async (id: string, payload: Partial<IWithdraw>) => {
  const isExist = await Withdraw.findById(id);
  if (!isExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Withdraw request not found');
  }
  if (isExist.status === 'paid') {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Withdraw request already paid',
    );
  }

  const result = await Withdraw.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

export const WithdrawService = {
  requestWithdraw,
  getAllWithdrawRequests,
  paidWithdraw,
};
