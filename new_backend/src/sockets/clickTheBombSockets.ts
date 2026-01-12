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
          io.to(roomCode).emit('updated_click_count', game.clickCount, game.prizePool);
          break;
        case 'PLAYER_EXPLODED':
          io.to(roomCode).emit('changed_turn', game.getCurrentTurnPlayer());
          io.to(roomCode).emit('player_exploded');
          break;
        case 'END_GAME':
          io.to(roomCode).emit('end_game_click_the_bomb');
          io.to(roomCode).emit('ended_minigame', room.getPlayers());
          break;
      }
    }
  });
};
