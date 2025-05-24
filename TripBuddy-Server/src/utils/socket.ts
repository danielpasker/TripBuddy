// description: This module initializes a Socket.IO server and provides functions to manage socket connections for real-time communication in a chat application.
import http from 'http';
import {Server as IOServer, Socket} from 'socket.io';

let io: IOServer;

export function initSocket(server: http.Server): IOServer {
  io = new IOServer(server, {
    cors: {origin: '*'},
  });

  io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('joinChat', (chatId: string) => {
      socket.join(chatId);
      console.log(`Socket ${socket.id} joined chat ${chatId}`);
    });

    socket.on('leaveChat', (chatId: string) => {
      socket.leave(chatId);
      console.log(`Socket ${socket.id} left chat ${chatId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getIO(): IOServer {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
}
