import { Server, Socket } from 'socket.io';
import { RoomManager } from '@engine-managers/RoomManager';
import { ClickTheBomb } from '@minigames/ClickTheBomb';
import { GAME_STATE_DURATION } from '@engine/core';
import { GameStateType } from '@shared/types';
import { COUNTDOWN_INTRO_MS } from '@shared/constants/gameRules';

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
        case 'NEXT_TURN':
          console.log('NEXT_TURN');
          room.setGameState(GameStateType.Animation);
          room.startTimer(COUNTDOWN_INTRO_MS);

          io.to(roomCode).emit('player_exploded', room.getPlayers());
          io.to(roomCode).emit('update_game_state', { ...room.getData(), endAt: room.getTimer()?.getEndAt() });
          break;
        case 'END_GAME':
          console.log('END_GAME');
          io.to(roomCode).emit('player_exploded', game.getCurrentTurnPlayer());
          room.startTimer(GAME_STATE_DURATION.MINIGAME);
          break;
      }
    }
  });
};
