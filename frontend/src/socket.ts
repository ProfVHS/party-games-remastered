import { io, Socket } from 'socket.io-client';

export const serverUrl = 'http://localhost:3000';

export const socket: Socket = io(serverUrl, {
  autoConnect: true,
  reconnection: true,
});
