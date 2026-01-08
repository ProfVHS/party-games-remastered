import { Server, Socket } from 'socket.io';
import { RoomManager } from '../engine/room/RoomManager';
import { ClickTheBomb } from '../engine/minigame/ClickTheBomb';

export const handleClickTheBomb = (io: Server, socket: Socket) => {
  socket.on('bomb_click', async () => {
    const roomCode = socket.data.roomCode;
    const room = RoomManager.getRoom(roomCode);
    if (!room) return { success: false, message: 'Room not found!' };

    const game = room.currentMinigame as ClickTheBomb;
    const response = game.click();

    if (response && response.success) {
      switch (response.state) {
        case 'INCREMENTED':
          io.to(roomCode).emit('updated_click_count', game.clickCount, game.prizePool);
          break;
        case 'PLAYER_EXPLODED':
          io.to(roomCode).emit('changed_turn', game.getCurrentTurnPlayer());
          io.to(roomCode).emit('player_exploded');
          break;
        case 'END_GAME':
          console.log(response.state);
          break;
      }
    }
  });
};
