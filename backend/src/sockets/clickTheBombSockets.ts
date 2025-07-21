import { Socket } from 'socket.io';
import * as roomRepository from '../repositories/roomRepository/roomRepository';
import { MinigameNamesEnum } from '../types/roomRepositoryTypes';
import { ChainableCommander } from 'ioredis';
import { client } from '../config/db';

export const clickTheBombSockets = (socket: Socket) => {
  socket.on('update_click_count', async () => {
    const roomCode = socket.data.roomCode;

    const minigameDataResponse = await roomRepository.getMinigameData(roomCode);
    const roomDataResponse = await roomRepository.getRoomData(roomCode);
    if (minigameDataResponse?.minigameName !== MinigameNamesEnum.clickTheBomb) return;

    if (!minigameDataResponse || !roomDataResponse) {
      console.error(`Game or minigame data not found`);
      return;
    }

    minigameDataResponse.clickCount += 1;

    const clickCount = minigameDataResponse.clickCount;
    const maxClicks = minigameDataResponse.maxClicks;

    if (clickCount >= maxClicks) {
      roomDataResponse.currentRound += 1;
      minigameDataResponse.clickCount = 0;

      // TODO: Handle player death and score adjustment logic here

      if (roomDataResponse.currentRound > roomDataResponse.maxRounds) {
        // TODO: Handle end of game logic here
        return;
      }

      // TODO: Update the current turn logic
    }

    // TODO: Update current player score data
    let multi: ChainableCommander = client.multi();
    await roomRepository.setRoomData(roomCode, roomDataResponse, multi);
    await roomRepository.setMinigameData(roomCode, minigameDataResponse, multi);
    multi.exec();

    socket.nsp.to(roomCode).emit('received_updated_clicks', clickCount);
  });
};
