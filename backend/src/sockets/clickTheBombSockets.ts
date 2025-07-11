import { Socket } from 'socket.io';
import * as roomRepository from '../repositories/roomRepository/roomRepository';

export const clickTheBombSockets = (socket: Socket) => {
  socket.on('update_click_count', async () => {
    const roomCode = socket.data.roomCode;

    const response = await roomRepository.getGameRoom(roomCode);

    if (!response) {
      console.error(`Game data not found`);
      return;
    }

    response.currentMinigameData.clickCount += 1;

    const clickCount = response.currentMinigameData.clickCount;
    const maxClicks = response.currentMinigameData.maxClicks;

    if (clickCount >= maxClicks) {
      response.currentRound += 1;
      response.currentMinigameData.clickCount = 0;

      // TODO: Handle player death and score adjustment logic here

      if (response.currentRound > response.maxRounds) {
        // TODO: Handle end of game logic here
        return;
      }

      // TODO: Update the current turn logic
    }

    // TODO: Update current player score data
    await roomRepository.updateMinigameData(roomCode, response.currentMinigameData);

    socket.nsp.to(roomCode).emit('received_updated_clicks', clickCount);
  });
};
