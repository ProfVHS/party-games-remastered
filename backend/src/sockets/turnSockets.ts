import { Socket } from 'socket.io';
import { getRoomData, setRoomData } from '../repositories/roomRepository/roomDataTable';
import { getAllPlayers } from '../repositories/roomRepository/playersTable';

export const turnSockets = (socket: Socket) => {
  socket.on('set_turn', async (turn?: number) => {
    const roomCode = socket.data.roomCode;
    const gameRoomData = await getRoomData(roomCode);

    if (gameRoomData) {
      gameRoomData.currentTurn = turn ? turn : 0;

      await setRoomData(roomCode, gameRoomData);

      // socket to clients
      // socket.nsp.to(roomCode).emit("", players[gameRoomData.currentTurn].nickname);
    }
  });

  socket.on('change_turn', async () => {
    const roomCode = socket.data.roomCode;

    const gameRoomData = await getRoomData(roomCode);
    const players = await getAllPlayers(roomCode);

    if (gameRoomData && players) {
      gameRoomData.currentTurn = gameRoomData.currentTurn !== players.length - 1 ? (gameRoomData.currentTurn += 1) : (gameRoomData.currentTurn = 0);

      await setRoomData(roomCode, gameRoomData);

      // socket to clients
      // socket.nsp.to(roomCode).emit("", players[gameRoomData.currentTurn].nickname);
    }
  });
};
