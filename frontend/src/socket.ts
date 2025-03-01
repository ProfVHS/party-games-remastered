import { io, Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL;

export const serverUrl = SOCKET_SERVER_URL || 'http://localhost:3000';

export const socket: Socket = io(serverUrl, {
  autoConnect: true,
  reconnection: true,
});
