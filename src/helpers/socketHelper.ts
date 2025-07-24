import colors from 'colors';
import { Server } from 'socket.io';
import { logger } from '../shared/logger';
import { Message } from '../app/modules/message/message.model';
import { Inbox } from '../app/modules/inbox/inbox.model';

const socket = (io: Server) => {
  io.on('connection', socket => {
    logger.info(colors.blue('A user connected'));

    socket.on('join', (inboxId: string) => {
      socket.join(inboxId);
      logger.info(colors.green(`User joined inbox: ${inboxId}`));
    });

    socket.on('send-message', async ({ inboxId, senderId, message }) => {
      try {
        const newMsg = await Message.create({
          inboxId,
          senderId,
          message,
        });

        if (newMsg) {
          await Inbox.updateOne({ _id: inboxId }, { $inc: { unreadCount: 1 } });
        }

        io.emit(`receive-message:${newMsg?.inboxId}`, newMsg);
      } catch (error: any) {
        logger.error(error);
      }
    });

    //disconnect
    socket.on('disconnect', () => {
      logger.info(colors.red('A user disconnect'));
    });
  });
};

export const socketHelper = { socket };
