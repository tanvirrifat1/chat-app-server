import { IWithdraw } from './withdraw.interface';
import { Withdraw } from './withdraw.model';

const getMyWallet = async (userId: string) => {
  const withdrawals = await Withdraw.find({
    user: userId,
    status: 'pending',
  }).lean<IWithdraw[]>();

  const totalAmount = withdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);

  return totalAmount;
};

const getMyWalletPaid = async (userId: string) => {
  const withdrawals = await Withdraw.find({
    user: userId,
    status: 'paid',
  }).lean<IWithdraw[]>();

  const totalAmount = withdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);

  return totalAmount;
};

const getAllWallet = async (query: Record<string, unknown>) => {
  const { page, limit } = query;

  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  // Aggregate withdrawals grouped by user
  const aggregated = await Withdraw.aggregate([
    {
      $match: { status: 'pending' },
    },
    {
      $group: {
        _id: '$user',
        totalAmount: { $sum: '$amount' },
      },
    },
    {
      $lookup: {
        from: 'users', // collection name in MongoDB
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: '$user',
    },
    {
      $project: {
        _id: 0,
        userId: '$user._id',
        name: '$user.name',
        email: '$user.email',
        totalAmount: 1,
      },
    },
    { $sort: { totalAmount: -1 } }, // highest total first
    { $skip: skip },
    { $limit: size },
  ]);

  const totalUsers = await Withdraw.distinct('user');

  return {
    result: aggregated,
    page: pages,
    limit: size,
    total: totalUsers.length,
  };
};

export const WithdrawService = {
  getMyWallet,
  getMyWalletPaid,
  getAllWallet,
};
