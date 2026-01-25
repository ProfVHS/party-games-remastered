import { Server, Socket } from 'socket.io';
import { RoomManager } from '../engine/managers/RoomManager';
import { ClickTheBomb } from '../engine/minigame/ClickTheBomb';

export const handleClickTheBomb = (io: Server, socket: Socket) => {
  socket.on('bomb_click', async () => {
    const roomCode = socket.data.roomCode;
    const room = RoomManager.getRoom(roomCode)!;

    const game = room.currentMinigame as ClickTheBomb;
    const response = game.click();

    if (response && response.success) {
      switch (response.state) {
        case 'INCREMENTED':
          const { clickCount, prizePool } = game.getState();
          io.to(roomCode).emit('updated_click_count', clickCount, prizePool, game.getTimer().getEndAt());
          break;
        case 'PLAYER_EXPLODED':
          io.to(roomCode).emit('player_exploded', game.getCurrentTurnPlayer());
          break;
        case 'END_GAME':
          io.to(roomCode).emit('ended_minigame', room.getPlayers());
          break;
      }
    }
  });
};
