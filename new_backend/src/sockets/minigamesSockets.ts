import { Server, Socket } from 'socket.io';
import { RoomManager } from '../engine/room/RoomManager';
import { TurnBasedMinigame } from '../engine/minigame/TurnBasedMinigame';

export const handleMinigames = (io: Server, socket: Socket) => {
  socket.on('change_turn', async () => {
    const room = RoomManager.getRoom(socket.data.roomCode);
    if (!room) return { success: false, message: 'Room not found!' };

    const game = room.currentMinigame as TurnBasedMinigame;
    game.nextTurn();
  });

  socket.on('get_turn', async () => {
    const roomCode = socket.data.roomCode;
    const room = RoomManager.getRoom(roomCode);
    if (!room) return { success: false, message: 'Room not found!' };

    const game = room.currentMinigame as TurnBasedMinigame;
    io.to(roomCode).emit('got_turn', game.currentTurn);
  });
};
