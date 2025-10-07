import { Socket } from 'socket.io';
import { MinigameNamesEnum, RoomStatusEnum } from '@shared/types';
import { startMinigameService } from '@minigameService';
import * as roomRepository from '@roomRepository';
import { MinigameEntryType } from '@shared/types/RoomSettingsType';

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

const getRandomMinigames = (numberOfMinigames: number = 2): MinigameEntryType[] => {
  let allMinigames = Object.values(MinigameNamesEnum);

  if (numberOfMinigames < 2 || numberOfMinigames > allMinigames.length) {
    throw new Error(`Number of minigames must be between 2 and ${allMinigames.length}, but received ${numberOfMinigames}`);
  }

  const minigames: MinigameEntryType[] = [];

  for (let i = 0; i < numberOfMinigames; i++) {
    const index = Math.floor(Math.random() * allMinigames.length);
    minigames.push({ name: allMinigames[index] });

    if (allMinigames.length === 1) {
      allMinigames = Object.values(MinigameNamesEnum);
    } else {
      allMinigames.splice(index, 1);
    }
  }

  return minigames;
};

export const minigameSockets = (socket: Socket) => {
  socket.on('verify_minigames', async () => {
    const roomCode = socket.data.roomCode;
    const roomSettings = await roomRepository.getRoomSettings(roomCode);

    if (roomSettings && roomSettings.isRandomMinigames && roomSettings.minigames.length === 0) {
      await roomRepository.updateRoomSettings(roomCode, { minigames: getRandomMinigames(roomSettings.numberOfMinigames) });
    } else if (roomSettings && roomSettings.minigames.length < 2) {
      throw new Error(`Minimum number of minigames is 2`);
    }
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
