import { Socket } from 'socket.io';
import { MinigameNamesEnum, RoomStatusEnum } from '@shared/types';
import { startMinigameService } from '@minigameService';
import * as roomRepository from '@roomRepository';
import { MIN_PLAYERS_TO_START } from '@shared/constants/gameRules';
import { LockName, ReadyNameEnum } from '@backend-types';

const startMinigame = async (roomCode: string, socket: Socket) => {
  await roomRepository.deleteScheduledMinigames(roomCode);
  await roomRepository.updateRoomData(roomCode, { status: RoomStatusEnum.game });
  const response = await startMinigameService(roomCode);

  if (!response.success) {
    socket.nsp.to(roomCode).emit('failed_to_start_minigame');
    return;
  }

  // Payload: { minigameData }
  socket.nsp.to(roomCode).emit('started_minigame', response.payload);
};

export const minigameSockets = (socket: Socket) => {
  socket.on('set_minigames', async (minigames: MinigameNamesEnum[]) => {
    const roomCode = socket.data.roomCode;
    await roomRepository.setMinigames(roomCode, minigames);
  });

  socket.on('start_minigame_queue', async (skipQueue: boolean = false) => {
    const roomCode = socket.data.roomCode;
    const roomData = await roomRepository.getRoomData(roomCode);

    if (!roomData || roomData.status === RoomStatusEnum.game) {
      console.error(`Room not found or is already in game for room: ${roomCode}`);
      return;
    }

    if (skipQueue) {
      await startMinigame(roomCode, socket);
      return;
    }

    await roomRepository.toggleReady(roomCode, socket.id, ReadyNameEnum.minigame);
    const playersReady = await roomRepository.getReadyPlayersCount(roomCode, ReadyNameEnum.minigame);
    const playersIds = await roomRepository.getAllPlayerIds(roomCode);

    //TODO: Change all player to only connected players

    // Start the minigame immediately
    if (playersReady === playersIds.length) {
      const started = await roomRepository.acquireLock(roomCode, LockName.minigame, 10);

      if (!started) {
        console.log('Minigame already started or scheduled');
        return;
      }

      await startMinigame(roomCode, socket);
      return;
    }

    //TODO: Send socket to clients (frontend will start progressbar or smth)

    // The minigame will start in 5 seconds
    if (playersReady >= MIN_PLAYERS_TO_START) {
      const started = await roomRepository.acquireLock(roomCode, LockName.minigame, 10);

      if (!started) {
        console.log('Minigame already started or scheduled');
        return;
      }

      const startAt = Date.now() + 5000;
      await roomRepository.addScheduledMinigames(roomCode, startAt);
      await startMinigameScheduler(socket);
      return;
    }
  });
};

const startMinigameScheduler = async (socket: Socket) => {
  while (true) {
    const ready = await roomRepository.getReadyScheduledMinigames();

    if (ready.length === 0) {
      const futureGames = await roomRepository.getScheduledMinigames();

      if (futureGames === 0) {
        console.log('No more scheduled minigames, stopping worker');
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      continue;
    }

    for (const roomCode of ready) {
      const gotLock = await roomRepository.acquireLock(roomCode, LockName.watch, 10);

      if (!gotLock) {
        console.log(`Skipping worker for room: ${roomCode}, already being processed`);
        continue;
      }

      try {
        await startMinigame(roomCode, socket);
      } catch (err) {
        console.error('Failed to start minigame', err);
      } finally {
        await roomRepository.deleteLock(roomCode, LockName.watch);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};
