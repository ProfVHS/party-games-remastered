import { Server, Socket } from 'socket.io';
import { RoomManager } from '@engine-managers/RoomManager';
import { ClickTheBomb } from '@minigames/ClickTheBomb';
import { GameStateType } from '@shared/types';
import { COUNTDOWN } from '@shared/constants/gameRules';

export const handleClickTheBomb = (io: Server, socket: Socket) => {
  socket.on('bomb_click', async () => {
    const roomCode = socket.data.roomCode;
    const room = RoomManager.getRoom(roomCode)!;

    const game = room.currentMinigame as ClickTheBomb;
    const response = game.click();

    if (response && response.success) {
      const { clickCount, prizePool, prizePoolIncrease } = game.getState();

      switch (response.state) {
        case 'INCREMENTED':
          io.to(roomCode).emit('show_score', prizePoolIncrease);
          io.to(roomCode).emit('updated_click_count', clickCount, prizePool, game.getTimer().getEndAt());
          break;
        case 'NEXT_TURN':
          console.log('NEXT_TURN');
          room.setGameState(GameStateType.Animation);
          room.startTimer(COUNTDOWN.INTRO_MS);

          io.to(roomCode).emit('player_exploded', room.getPlayers());
          io.to(roomCode).emit('update_game_state', { ...room.getData(), endAt: room.getTimer()?.getEndAt() });
          break;
        case 'END_GAME':
          console.log('END_GAME');
          io.to(roomCode).emit('player_exploded', game.getCurrentTurnPlayer());
          room.startTimer(COUNTDOWN.MINIGAME_MS);
          break;
      }
    }
  });
};
