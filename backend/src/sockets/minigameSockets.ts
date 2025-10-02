import { Socket } from 'socket.io';
import { MinigameNamesEnum, RoomStatusEnum } from '@shared/types';
import { startMinigameService } from '@minigameService';
import * as roomRepository from '@roomRepository';

const startMinigame = async (roomCode: string, socket: Socket) => {
  const response = await startMinigameService(roomCode);

  if (!response.success) {
    socket.nsp.to(roomCode).emit('failed_to_start_minigame');
    return;
  }

  //TODO: Is it necessary to send roomData?
  // Payload: { roomData, minigameData }
  socket.nsp.to(roomCode).emit('started_minigame', response.payload);
};

export const minigameSockets = async (socket: Socket) => {
  socket.on('set_minigames', async (minigames: MinigameNamesEnum[]) => {
    const roomCode = socket.data.roomCode;
    await roomRepository.setMinigames(roomCode, minigames);
  });

  socket.on('start_minigame', async () => {
    const roomCode = socket.data.roomCode;
    await startMinigame(roomCode, socket);
  });

  socket.on('start_minigame_queue', async () => {
    const roomCode = socket.data.roomCode;

    await roomRepository.toggleReady(roomCode, socket.id);
    const playersReady = await roomRepository.getReadyPlayersCount(roomCode);
    const players = await roomRepository.getAllPlayers(roomCode);

    //TODO: Maybe merge this two sockets start_minigame and start_minigame_queue
    //TODO: Instead all players have to be ready reduce it to min players needed to play the game for example 4
    if (playersReady == players.length) {
      const started = await roomRepository.isMinigameStarted(roomCode);

      if (started) {
        await roomRepository.updateRoomData(roomCode, { status: RoomStatusEnum.game });
        await startMinigame(roomCode, socket);
      }
    }
  });
};
