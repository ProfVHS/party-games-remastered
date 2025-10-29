import { Socket } from 'socket.io';
import { CLICK_THE_BOMB_RULES } from '@shared/constants/gameRules';
import { sendAllPlayers } from '@sockets';
import { MinigameDataType, MinigameNamesEnum, PlayerStatusEnum, PlayerType } from '@shared/types';
import { getAllPlayers, getMinigameData, setMinigameData, updateMinigameData, updatePlayerScore } from '@roomRepository';
import { findAlivePlayersService, syncPlayerScoreService, syncPlayerUpdateService } from '@playerService';
import { changeTurnService, endMinigameService } from '@minigameService';
import { createClickTheBombConfig } from '@config/minigames';

const POINTS = CLICK_THE_BOMB_RULES.POINTS;
const LOSS = CLICK_THE_BOMB_RULES.LOSS;

export const clickTheBombSockets = (socket: Socket) => {
  socket.on('update_click_count', async (countdownExpired: boolean) => {
    const roomCode = socket.data.roomCode;

    try {
      const minigame: MinigameDataType | null = await getMinigameData(roomCode);
      const players: PlayerType[] | null = await getAllPlayers(roomCode);

      if (!minigame) {
        throw new Error(`No data found for room "${roomCode}".`);
      }

      if (minigame.minigameName != MinigameNamesEnum.clickTheBomb) {
        throw new Error(`Data is not of type ClickTheBombDataType: ${minigame}`);
      }

      if (!players) {
        throw new Error(`No players found for room "${roomCode}"`);
      }

      let newClickCount = minigame.clickCount + 1;
      const currentPlayer = players.find((p) => p.id === socket.id);

      if (!currentPlayer) {
        throw new Error(`Current player not found (id: ${socket.id})`);
      }

      let newStreak = minigame.streak;
      let playerExploded = false;
      const prizePoolDelta = newStreak > POINTS.length ? POINTS[POINTS.length - 1] : POINTS[newStreak];
      let newPrizePool = minigame.prizePool + prizePoolDelta;

      console.log('Prize pool - ', minigame.prizePool);

      // Player Exploded
      if (minigame.maxClicks === newClickCount || countdownExpired) {
        const alivePlayers = await findAlivePlayersService(players);

        newClickCount = 0;
        playerExploded = true;
        newPrizePool = 0;
        newStreak = 0;

        await syncPlayerUpdateService(roomCode, currentPlayer, { isAlive: false, status: PlayerStatusEnum.dead });
        await syncPlayerScoreService(roomCode, currentPlayer, LOSS);

        // End game
        if (alivePlayers && alivePlayers.length <= 2) {
          await sendAllPlayers(socket, roomCode, players);
          await endMinigameService(roomCode, socket);
          return;
        }

        const newTurnData = await changeTurnService(roomCode);
        const newClickTheBombConfig = createClickTheBombConfig(alivePlayers!.length);

        await setMinigameData(roomCode, newClickTheBombConfig);

        socket.nsp.to(roomCode).emit('changed_turn', newTurnData);
      }

      if (!playerExploded) {
        await updateMinigameData(roomCode, { clickCount: newClickCount, streak: newStreak + 1, prizePool: newPrizePool });
        socket.nsp.to(socket.id).emit('show_score', playerExploded, prizePoolDelta);
      }

      await sendAllPlayers(socket, roomCode, players);
      socket.nsp.to(roomCode).emit('updated_click_count', newClickCount, newPrizePool);
    } catch (error) {
      throw new Error(`clickTheBombSockets an error occurred: ${error}`);
    }
  });

  socket.on('streak_reset', async () => {
    const roomCode = socket.data.roomCode;

    await updateMinigameData(roomCode, { streak: 0, prizePool: 0 });
  });

  socket.on('grant_prize_pool', async () => {
    const roomCode = socket.data.roomCode;

    const minigame = await getMinigameData(roomCode);

    if (!minigame) {
      throw new Error(`No data found for room "${roomCode}".`);
    }

    if (minigame.minigameName != MinigameNamesEnum.clickTheBomb) {
      throw new Error(`Data is not of type ClickTheBombDataType: ${minigame}`);
    }

    await updatePlayerScore(roomCode, socket.id, minigame.prizePool);
    await sendAllPlayers(socket, roomCode);
  });
};
