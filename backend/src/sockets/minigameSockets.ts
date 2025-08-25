import { Socket } from 'socket.io';
import { MinigameNamesEnum } from '../../../shared/types';
import * as roomService from '../services/roomService';
import * as roomRepository from '../repositories/roomRepository/roomRepository';

export const minigameSockets = (socket: Socket) => {
  socket.on('set_minigames', async (minigames: MinigameNamesEnum[]) => {
    const roomCode = socket.data.roomCode;
    await roomRepository.setMinigames(roomCode, minigames);
  });

  socket.on('start_minigame', async (minigame: MinigameNamesEnum) => {
    const playerID = socket.id;
    const roomCode = socket.data.roomCode;
    const response = await roomService.startMinigameService(roomCode, minigame);

    if (!response.success) {
      socket.nsp.to(playerID).emit('failed_to_start_minigame');
      return;
    }

    // Payload: { roomData, minigameData }
    socket.nsp.in(roomCode).emit('started_minigame', response.payload);
  });
};
