import {Server, Socket} from 'socket.io';
import {verify} from 'jsonwebtoken';
import {Chat} from '@models/chatModel';
import {Message} from '@models/messageModel';
import {JwtPayload} from '@customTypes/request';
import {Env} from '@env';

export const registerChatSocket = (io: Server) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) throw new Error('Missing token');

      const secret = Env.JWT_TOKEN_SECRET!;
      const jwtPayload = verify(token, secret) as JwtPayload;
      socket.data.userId = jwtPayload._id;
      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      socket.emit('error', 'Authentication failed');
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.data.userId}`);
    socket.on('joinChat', async ({chatId}) => {
      try {
        const chat = await Chat.findById(chatId).select('participantsIds');
        if (!chat) return socket.emit('error', 'Chat not found');

        const isMember = chat.participantsIds.some(id => id.equals(socket.data.userId));
        if (!isMember) return socket.emit('error', 'Forbidden');

        socket.join(chatId);
        socket.emit('joinedChat', chatId);
      } catch {
        socket.emit('error', 'Internal server error');
      }
    });

    socket.on('chatMessage', async ({chatId, content, timestamp}) => {
      if (!content?.trim()) return;

      try {
        const chat = await Chat.findById(chatId).select('participantsIds');
        if (!chat) return socket.emit('error', 'Chat not found');

        const isMember = chat.participantsIds.some(id => id.equals(socket.data.userId));
        if (!isMember) return socket.emit('error', 'Forbidden');

        const message = await Message.create({
          chatId,
          senderId: socket.data.userId,
          content,
          timestamp,
          readBy: [socket.data.userId], // Mark as read by the sender
        });

        io.to(chatId).emit('chatMessage', message);
      } catch {
        socket.emit('error', 'Internal server error');
      }
    });

    socket.on('markRead', async ({chatId}) => {
      await Message.updateMany(
        {chatId, senderId: {$ne: socket.data.userId}, readBy: {$ne: socket.data.userId}},
        {$addToSet: {readBy: socket.data.userId}}
      );
      io.to(chatId).emit('messagesRead', {chatId, userId: socket.data.userId});
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.data.userId}`);
    });
  });
};
