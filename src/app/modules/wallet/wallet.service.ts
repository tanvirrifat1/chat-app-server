import { IWallet } from './wallet.interface';
import { Wallet } from './wallet.model';

const getMyWallet = async (userId: string) => {
  const result = await Wallet.findOne({ user: userId });
  return result;
};

// const getMyWallet = async (userId: string, status?: string) => {
//   const query: Record<string, unknown> = { user: userId };

//   if (status) {
//     query.status = status;
//   }

//   const result = await Wallet.findOne(query);
//   return result;
// };

const getAllWallets = async (query: Record<string, unknown>) => {
  const { page, limit } = query;
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await Wallet.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .populate({
      path: 'user',
      select: 'name email phone image',
    });
  const total = await Wallet.countDocuments();

  return {
    result,
    page: pages,
    limit: size,
    total,
  };
};

export const WalletService = {
  getMyWallet,
  getAllWallets,
};
