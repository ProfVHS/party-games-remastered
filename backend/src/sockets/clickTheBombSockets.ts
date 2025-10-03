import { Socket } from 'socket.io';
import { CLICK_THE_BOMB_RULES } from '@shared/constants/gameRules';
import { sendAllPlayers } from '@sockets';
import { MinigameDataType, MinigameNamesEnum, PlayerStatusEnum, PlayerType } from '@shared/types';
import { getAllPlayers, getMinigameData, setMinigameData, updateMinigameData } from '@roomRepository';
import { syncPlayerScoreService, syncPlayerUpdateService, findAlivePlayersService } from '@playerService';
import { changeTurnService, endMinigameService } from '@minigameService';
import { createClickTheBombConfig } from '@config/minigames';

const POINTS = CLICK_THE_BOMB_RULES.POINTS;
const LOSS = CLICK_THE_BOMB_RULES.LOSS;

export const clickTheBombSockets = (socket: Socket) => {
  const sumArrayNumbers = (array: number[], limit = array.length) => {
    return array.slice(0, limit).reduce((sum, value) => sum + value, 0);
  };

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

      let newClickCount = (parseInt(minigame.clickCount) + 1).toString();
      const currentPlayer = players.find((p) => p.id === socket.id);

      if (!currentPlayer) {
        throw new Error(`Current player not found (id: ${socket.id})`);
      }

      const clickCountStreak = Number(minigame.streak);
      const POINTS_LENGTH = POINTS.length;
      let scoreDelta = clickCountStreak > 6 ? POINTS[6] : POINTS[clickCountStreak];
      let playerExploded = false;

      // Max number of clicks or countdown timer has ended
      if (minigame.maxClicks === newClickCount || countdownExpired) {
        const alivePlayers = await findAlivePlayersService(players);

        if (clickCountStreak >= POINTS_LENGTH) {
          // All numbers from array + (streak - POINTS_LENGTH) * last number + bomb loss points
          const arraySum = sumArrayNumbers(POINTS);
          const streakSum = (clickCountStreak - POINTS_LENGTH) * POINTS[POINTS_LENGTH - 1];
          scoreDelta = (arraySum + streakSum + LOSS) * -1;
        } else {
          // All numbers to index = clickCountStreak + bomb loss points
          const arraySum = sumArrayNumbers(POINTS, clickCountStreak);
          scoreDelta = (arraySum + LOSS) * -1;
        }

        // End game
        if (alivePlayers && alivePlayers.length <= 2) {
          await syncPlayerUpdateService(roomCode, currentPlayer.id, { isAlive: 'false', status: PlayerStatusEnum.dead }, players);
          await syncPlayerScoreService(roomCode, currentPlayer.id, scoreDelta, players);

          sendAllPlayers(socket, roomCode, players);
          endMinigameService(roomCode, socket);
          return;
        }

        const newTurnData = await changeTurnService(roomCode);
        const newClickTheBombConfig = createClickTheBombConfig(alivePlayers!.length);

        await setMinigameData(roomCode, newClickTheBombConfig);
        await syncPlayerUpdateService(roomCode, currentPlayer.id, { isAlive: 'false', status: PlayerStatusEnum.dead }, players);

        socket.nsp.to(roomCode).emit('changed_turn', newTurnData);

        newClickCount = '0';
        playerExploded = true;
      }

      // TODO: Change all console.error to throw new Error

      const newStreak = (Number(clickCountStreak) + 1).toString();
      await syncPlayerScoreService(roomCode, currentPlayer.id, scoreDelta, players);
      await updateMinigameData(roomCode, { clickCount: newClickCount, streak: newStreak });

      sendAllPlayers(socket, roomCode, players);
      socket.nsp.to(roomCode).emit('updated_click_count', newClickCount);
      socket.nsp.to(socket.id).emit('show_score', playerExploded, scoreDelta);
    } catch (error) {
      throw new Error(`clickTheBombSockets an error occurred: ${error}`);
    }
  });

  socket.on('reset_click_count_streak', async () => {
    const roomCode = socket.data.roomCode;

    await updateMinigameData(roomCode, { streak: '0' });
  });
};
