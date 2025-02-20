import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';

const SOCKET_PORT = process.env.SOCKET_PORT || 3000;

const app = express();
app.use(cors());

const socketServer = createServer(app);

const io = new Server(socketServer, {
  pingInterval: 5000, // Send a ping every 5 seconds
  pingTimeout: 3000, // Wait 3 seconds for a response
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const handleModulesOnConnection = async (socket: Socket) => {
  console.log(`New connection: ${socket.id}`);

  socket.on('message', (msg) => {
    console.log(msg);
  });

  socket.on('disconnect', (reason) => {
    console.log(`Disconnected: ${socket.id} (Reason: ${reason})`);
  });

  socket.on('error', (err) => {
    console.error(`Socket error: ${err}`);
  });
};

io.on('connection', handleModulesOnConnection);

socketServer.listen(SOCKET_PORT, () => {
  console.log(`Socket server is running on port ${SOCKET_PORT}`);
});
