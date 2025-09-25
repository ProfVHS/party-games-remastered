import { Socket } from 'socket.io';
import { getAllPlayers } from '../repositories/roomRepository/playersTable';
import * as roomRepository from '../repositories/roomRepository/roomDataTable';

export const turnSockets = (socket: Socket) => {
  socket.on('set_turn', async (turn: number) => {
    const roomCode = socket.data.roomCode;
    const players = await getAllPlayers(roomCode);

    await roomRepository.updateRoomData(roomCode, { currentTurn: turn.toString() });
    socket.nsp.to(roomCode).emit('setTurn', players[turn].nickname);
  });

  socket.on('change_turn', async () => {
    const roomCode = socket.data.roomCode;
    const players = await getAllPlayers(roomCode);
    const roomData = await roomRepository.getRoomData(roomCode);

    if (!roomData) {
      console.error(`Room data not found for room: ${roomCode}`);
      return;
    }

    var nextTurn: number = Number(roomData.currentTurn) + 1;

    roomData.currentTurn = nextTurn.toString();

    await roomRepository.setRoomData(roomCode, roomData);

    socket.nsp.to(roomCode).emit('nextTurn', players[nextTurn].nickname);
  });
};
