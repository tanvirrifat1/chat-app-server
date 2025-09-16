import { Withdraw } from './withdraw.model';

const getMyWallet = async (userId: string) => {
  const withdrawals = await Withdraw.find({ user: userId });

  const totalAmount = withdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);

  return totalAmount;
};

export const WithdrawService = {
  getMyWallet,
};
