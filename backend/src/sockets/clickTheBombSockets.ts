import { Socket } from 'socket.io';
import { CLICK_THE_BOMB_RULES } from '@shared/constants/gameRules';
import { sendAllPlayers } from '@sockets';
import { MinigameDataType, MinigameNamesEnum, PlayerStatusEnum, PlayerType } from '@shared/types';
import { getAllPlayers, getMinigameData, setMinigameData, updateMinigameData, updatePlayerScore } from '@roomRepository';
import { findAlivePlayersService, syncPlayerScoreService, syncPlayerUpdateService } from '@playerService';
import { changeTurnService, endMinigameService } from '@minigameService';
import { createClickTheBombConfig } from '@config/minigames';
import { NotFoundError } from '../errors/NotFoundError';
import { handleSocketError } from '../errors/AppError';
import { UnprocessableEntityError } from '../errors/UnprocessableEntityError';
import { ErrorEventNameEnum } from '@backend-types';

const POINTS = CLICK_THE_BOMB_RULES.POINTS;
const LOSS = CLICK_THE_BOMB_RULES.LOSS;

export const clickTheBombSockets = (socket: Socket) => {
  socket.on('bomb_click', async (countdownExpired: boolean) => {
    const roomCode = socket.data.roomCode;

    try {
      const minigame: MinigameDataType | null = await getMinigameData(roomCode);
      const players: PlayerType[] | null = await getAllPlayers(roomCode);

      if (!minigame) {
        throw new NotFoundError('Minigame', roomCode);
      }

      if (minigame.minigameName != MinigameNamesEnum.clickTheBomb) {
        throw new UnprocessableEntityError('minigame type', 'Click the Bomb', minigame.minigameName);
      }

      if (!players) {
        throw new NotFoundError('Players', roomCode);
      }

      let newClickCount = minigame.clickCount + 1;
      const currentPlayer = players.find((p) => p.id === socket.id);

      if (!currentPlayer) {
        throw new NotFoundError('Player', roomCode);
      }

      let newStreak = minigame.streak + 1;
      const prizePoolDelta = newStreak > POINTS.length - 1 ? POINTS.at(-1) || 0 : POINTS[newStreak - 1];
      const newPrizePool = minigame.prizePool + prizePoolDelta;

      // Player Exploded
      if (minigame.maxClicks === newClickCount || countdownExpired) {
        const alivePlayers = await findAlivePlayersService(players);

        await syncPlayerUpdateService(roomCode, currentPlayer, { isAlive: false, status: PlayerStatusEnum.dead });
        await syncPlayerScoreService(roomCode, currentPlayer, LOSS);

        // End game
        if (alivePlayers && alivePlayers.length <= 2) {
          await sendAllPlayers(socket, roomCode, players);
          socket.nsp.to(roomCode).emit('end_game_click_the_bomb');
          await endMinigameService(roomCode, socket);
          return;
        }

        const newTurnData = await changeTurnService(roomCode);
        const newClickTheBombConfig = createClickTheBombConfig(alivePlayers!.length);

        await setMinigameData(roomCode, newClickTheBombConfig);
        await sendAllPlayers(socket, roomCode, players);

        socket.nsp.to(roomCode).emit('changed_turn', newTurnData);
        socket.nsp.to(roomCode).emit('player_exploded');
      }
      // Update click count by 1
      else {
        await updateMinigameData(roomCode, { clickCount: newClickCount, streak: newStreak, prizePool: newPrizePool });
        socket.nsp.to(socket.id).emit('show_score', prizePoolDelta);

        await sendAllPlayers(socket, roomCode, players);
        socket.nsp.to(roomCode).emit('updated_click_count', newClickCount, newPrizePool);
      }
    } catch (error: unknown) {
      handleSocketError(socket, roomCode, error, ErrorEventNameEnum.clickTheBomb);
    }
  });

  socket.on('streak_reset', async () => {
    const roomCode = socket.data.roomCode;

    await updateMinigameData(roomCode, { streak: 0, prizePool: 0 });
  });

  socket.on('grant_prize_pool', async () => {
    const roomCode = socket.data.roomCode;

    try {
      const minigame = await getMinigameData(roomCode);

      if (!minigame) {
        throw new NotFoundError('Minigame', roomCode);
      }

      if (minigame.minigameName != MinigameNamesEnum.clickTheBomb) {
        throw new UnprocessableEntityError('minigame type', 'Click the Bomb', minigame.minigameName);
      }

      await updatePlayerScore(roomCode, socket.id, minigame.prizePool);
      await sendAllPlayers(socket, roomCode);
    } catch (error: unknown) {
      handleSocketError(socket, roomCode, error, ErrorEventNameEnum.clickTheBomb);
    }
  });
};
