import { Server, Socket } from 'socket.io';
import { RoomManager } from '../engine/managers/RoomManager';
import { TurnBasedMinigame } from '../engine/minigame/base/TurnBasedMinigame';

export const handleMinigames = (io: Server, socket: Socket) => {
  socket.on('change_turn', async () => {
    const roomCode = socket.data.roomCode;
    const room = RoomManager.getRoom(roomCode);
    if (!room) return { success: false, message: 'Room not found!' };

    const game = room.currentMinigame as TurnBasedMinigame;
    game.nextTurn();
    io.to(roomCode).emit('got_turn', game.getCurrentTurnPlayer());
    io.to(roomCode).emit('got_players', room.getPlayers());
  });

  socket.on('get_turn', async () => {
    const roomCode = socket.data.roomCode;
    const room = RoomManager.getRoom(roomCode);
    if (!room) return { success: false, message: 'Room not found!' };

    const game = room.currentMinigame as TurnBasedMinigame;
    io.to(roomCode).emit('got_turn', game.getCurrentTurnPlayer());
  });
};
