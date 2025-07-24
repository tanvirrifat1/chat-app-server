import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import { IInbox } from './inbox.interface';
import { Inbox } from './inbox.model';
import { Message } from '../message/message.model';

const createInbox = async (payload: IInbox) => {
  const isUser = await User.findById(payload.receiverId);

  if (!isUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  let inbox = await Inbox.findOne({
    senderId: payload.senderId,
    receiverId: payload.receiverId,
  });

  if (!inbox) {
    inbox = await Inbox.create(payload);
  } else {
    inbox.unreadCount += 1;
    inbox = await inbox.save();
  }
  return inbox;
};

const getAllInboxFromDb = async (
  id: string,
  query: Record<string, unknown>,
) => {
  const { page, limit } = query;

  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const messages = await Inbox.find({
    $or: [{ senderId: id }, { receiverId: id }],
  })
    .populate('senderId')
    .populate('receiverId')
    .skip(skip)
    .limit(size)
    .lean();

  const inboxIds = messages.map(msg => msg._id);

  const lastMessages = await Message.aggregate([
    { $match: { inboxId: { $in: inboxIds } } },
    { $sort: { createdAt: -1 } },
    { $group: { _id: '$inboxId', lastMessage: { $first: '$$ROOT' } } },
  ]);

  const lastMessageMap = new Map(
    lastMessages.map(msg => [msg._id.toString(), msg.lastMessage]),
  );

  // transform data

  const transformedMessages = messages.map(msg => {
    const isUserSender = msg.senderId._id.toString() === id;
    const receiver: any = isUserSender ? msg.receiverId : msg.senderId;

    return {
      inboxId: msg._id,
      receiverId: receiver._id || null,
      image: receiver.image || null,
      name: receiver.name || null,
      lastMessage: lastMessageMap.get(msg._id.toString()) || null,
      unreadCount: msg.unreadCount,
    };
  });

  const count = await Inbox.countDocuments({
    $or: [{ senderId: id }, { receiverId: id }],
  });

  return {
    data: transformedMessages,
    meta: {
      page: pages,
      limit: size,
      total: count,
    },
  };
};

export const InboxService = {
  createInbox,
  getAllInboxFromDb,
};
