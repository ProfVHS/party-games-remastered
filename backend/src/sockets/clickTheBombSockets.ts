import { Socket } from 'socket.io';
import { CLICK_THE_BOMB_RULES } from '@config/gameRules';
import { sendAllPlayers } from './playerSockets';
import { MinigameDataType, MinigameNamesEnum, PlayerType } from '@shared/types';
import { getAllPlayers, getMinigameData, setMinigameData, updateMinigameData } from '@roomRepository';
import { syncPlayerScoreService, syncPlayerUpdateService, findAlivePlayersService } from 'services/playerService';
import { changeTurnService } from 'services/roomService';
import { createClickTheBombConfig } from '@config/minigames';

export const clickTheBombSockets = (socket: Socket) => {
  socket.on('update_click_count', async () => {
    const roomCode = socket.data.roomCode;

    try {
      const minigame: MinigameDataType | null = await getMinigameData(roomCode);
      const players: PlayerType[] | null = await getAllPlayers(roomCode);

      if (!minigame || minigame == null) {
        throw new Error(`No data found for room "${roomCode}".`);
      }

      if (minigame.minigameName != MinigameNamesEnum.clickTheBomb) {
        throw new Error(`Data is not of type ClickTheBombDataType: ${minigame}`);
      }

      if (!players) {
        throw new Error(`No players found for room "${roomCode}"`);
      }

      const newClickCount = (parseInt(minigame.clickCount) + 1).toString();
      const currentPlayer = players.find((p) => p.id === socket.id);

      if (!currentPlayer) {
        throw new Error(`Current player not found (id: ${socket.id})`);
      }

      let scoreDelta = CLICK_THE_BOMB_RULES.BOMB_CLICK;

      if (minigame.maxClicks === newClickCount) {
        const alivePlayers = await findAlivePlayersService(players);

        if (alivePlayers && alivePlayers.length == 2) {
          const winner = alivePlayers.find((p) => p.id !== currentPlayer.id);
          if (winner) await syncPlayerScoreService(roomCode, winner.id, CLICK_THE_BOMB_RULES.WIN, players);

          await syncPlayerUpdateService(roomCode, currentPlayer.id, { isAlive: 'false' }, players);
          await syncPlayerScoreService(roomCode, currentPlayer.id, CLICK_THE_BOMB_RULES.LOSS, players);

          sendAllPlayers(socket, roomCode, players);
          console.log(`ClickTheBomb game ended in room ${roomCode}`);
          // TODO: End the game
          return;
        }

        await syncPlayerUpdateService(roomCode, currentPlayer.id, { isAlive: 'false' }, players);
        const currentTurnPlayerNickname = await changeTurnService(roomCode);
        scoreDelta = CLICK_THE_BOMB_RULES.LOSS;

        socket.nsp.to(roomCode).emit('changed_turn', currentTurnPlayerNickname);

        const newClickTheBombConfig = createClickTheBombConfig(alivePlayers!.length);
        await setMinigameData(roomCode, newClickTheBombConfig);

        console.log('Powinien zginać i przekazać turę', newClickCount);
      }

      // TODO: Change all console.error to throw new Error

      await syncPlayerScoreService(roomCode, currentPlayer.id, scoreDelta, players);
      await updateMinigameData(roomCode, { clickCount: newClickCount });

      sendAllPlayers(socket, roomCode, players);
      socket.nsp.to(roomCode).emit('updated_click_count', newClickCount);
    } catch (error) {
      throw new Error(`clickTheBombSockets an error occurred: ${error}`);
    }
  });
};
