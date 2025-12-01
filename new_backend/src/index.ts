import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { handleConnection } from './sockets/connectionSockets';
import { handlePlayers } from './sockets/playersSockets';
import { handleRoom } from './sockets/roomSockets';

dotenv.config();

const PORT = process.env.SOCKET_PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const app = express();
app.use(cors());
const socketServer = createServer(app);

const io = new Server(socketServer, {
  pingInterval: 5000,
  pingTimeout: 3000,
  cors: {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST'],
  },
});

socketServer.listen(PORT, () => {
  console.log(`Socket server is running on port ${PORT}`);
});

io.on('connection', (socket: Socket) => {
  console.log(`Socket connection started: ${socket.id}`);

  handleConnection(io, socket);
  handlePlayers(io, socket);
  handleRoom(io, socket);
});
