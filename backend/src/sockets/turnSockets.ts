import { Socket } from 'socket.io';

export const turnSockets = (socket: Socket) => {
  socket.on('set_turn', async (turn?: number) => {
    const roomCode = socket.data.roomCode;

    // socket to clients
    // socket.nsp.to(roomCode).emit("", players[gameRoomData.currentTurn].nickname);
  });

  socket.on('change_turn', async () => {
    const roomCode = socket.data.roomCode;

    // socket to clients
    // socket.nsp.to(roomCode).emit("", players[gameRoomData.currentTurn].nickname);
  });
};
