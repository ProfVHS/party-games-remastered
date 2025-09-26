import { getAllPlayers, getMinigameData, updateMinigameData } from '@roomRepository';
import { syncPlayerScore, syncPlayerUpdate, findAlivePlayers } from 'services/playerService';
import { MinigameDataType, MinigameNamesEnum, PlayerType } from '@shared/types';
import { Socket } from 'socket.io';
import { sendAllPlayers } from './playerSockets';

export const clickTheBombSockets = (socket: Socket) => {
  socket.on('update_click_count', async () => {
    const roomCode = socket.data.roomCode;

    try {
      const minigame: MinigameDataType | null = await getMinigameData(roomCode);
      const players: PlayerType[] | null = await getAllPlayers(roomCode);

      if (!minigame) {
        console.error(`[clickTheBombSockets] No data found for room "${roomCode}".`);
        return;
      }

      if (minigame.minigameName != MinigameNamesEnum.clickTheBomb) {
        console.warn(`[clickTheBombSockets] Data is not of type ClickTheBombDataType.`, minigame);
        return;
      }

      if (!players) {
        console.error(`[clickTheBombSockets] No players found for room "${roomCode}"`);
        return;
      }

      // TODO: Add it to config
      const SCORE = {
        WIN: 70,
        LOSS: -30,
        BOMB_CLICK: 30,
      };

      const newClickCount = (parseInt(minigame.clickCount) + 1).toString();
      const currentPlayer = players.find((p) => p.id === socket.id);

      if (!currentPlayer) {
        console.error(`[clickTheBombSockets] Current player not found (id: ${socket.id})`);
        return;
      }

      let scoreDelta = SCORE.BOMB_CLICK;

      if (minigame.maxClicks === newClickCount) {
        const alivePlayers = await findAlivePlayers(players);

        if (alivePlayers && alivePlayers.length == 2) {
          const winner = alivePlayers.find((p) => p.id !== currentPlayer.id);
          if (winner) syncPlayerScore(roomCode, winner.id, SCORE.WIN, players);

          syncPlayerUpdate(roomCode, currentPlayer.id, { isAlive: 'false' }, players);
          syncPlayerScore(roomCode, currentPlayer.id, SCORE.LOSS, players);

          sendAllPlayers(socket, roomCode, players);
          console.log(`ClickTheBomb game ended in room ${roomCode}`);
          // TODO: End the game
          return;
        }

        syncPlayerUpdate(roomCode, currentPlayer.id, { isAlive: 'false' }, players);
        scoreDelta = SCORE.LOSS;
        //TODO: Change turn
      }

      syncPlayerScore(roomCode, currentPlayer.id, scoreDelta, players);
      await updateMinigameData(roomCode, { clickCount: newClickCount });

      sendAllPlayers(socket, roomCode, players);
    } catch (error) {
      console.error(`[clickTheBombSockets] An error occurred:`, error);
    }
  });
};
