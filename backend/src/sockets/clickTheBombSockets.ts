import { Socket } from 'socket.io';
import { sendAllPlayers } from '@sockets';
import { handleSocketError } from '@errors';
import { ErrorEventNameEnum } from '@backend-types';
import { minigameRegistry } from '../engine/minigameRegistry';
import { ClickTheBombMinigame } from '../engine/minigames/clickTheBomb/clickTheBombMinigame';
import * as roomRepository from '@roomRepository';

export const clickTheBombSockets = (socket: Socket) => {
  socket.on('bomb_click', async (countdownExpired: boolean) => {
    const roomCode = socket.data.roomCode;
    const playerId = socket.id;
    const minigame = minigameRegistry.create('click_the_bomb', roomCode) as ClickTheBombMinigame;

    try {
      const result = await minigame.bombClick(playerId, countdownExpired);

      if (result.type === 'CLICK_UPDATED') {
        socket.nsp.to(socket.id).emit('show_score', result.prizePoolDelta);
        socket.nsp.to(roomCode).emit('updated_click_count', result.clickCount, result.prizePool);
      }

      if (result.type === 'TURN_CHANGED') {
        socket.nsp.to(roomCode).emit('changed_turn', result.turnData);
        socket.nsp.to(roomCode).emit('player_exploded');
      }

      if (result.type === 'PLAYER_EXPLODED') {
        socket.nsp.to(roomCode).emit('changed_turn', result.turnData);
        socket.nsp.to(roomCode).emit('player_exploded');
      }

      if (result.type === 'GAME_ENDED') {
        await sendAllPlayers(socket, roomCode, result.players);
        socket.nsp.to(roomCode).emit('end_game_click_the_bomb');

        const players = await roomRepository.getAllPlayers(roomCode);
        socket.nsp.to(roomCode).emit('ended_minigame', players);
      }
    } catch (error) {
      handleSocketError(socket, roomCode, error, ErrorEventNameEnum.clickTheBomb);
    }
  });

  socket.on('streak_reset', async () => {
    const roomCode = socket.data.roomCode;
    const minigame = minigameRegistry.create('click_the_bomb', roomCode) as ClickTheBombMinigame;
    await minigame.resetStreak();
  });

  socket.on('grant_prize_pool', async () => {
    const roomCode = socket.data.roomCode;
    const minigame = minigameRegistry.create('click_the_bomb', roomCode) as ClickTheBombMinigame;

    try {
      await minigame.grantPrizePool(socket.id);
      await sendAllPlayers(socket, roomCode);
    } catch (error: unknown) {
      handleSocketError(socket, roomCode, error, ErrorEventNameEnum.clickTheBomb);
    }
  });
};
