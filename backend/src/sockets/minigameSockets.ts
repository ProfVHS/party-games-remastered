import { Socket } from 'socket.io';
import { MinigameNamesEnum, RoomStatusEnum } from '@shared/types';
import { startMinigameService } from '@minigameService';
import * as roomRepository from '@roomRepository';
import { MIN_PLAYERS_TO_START } from '@shared/constants/gameRules';
import { LockName, ReadyNameEnum } from '@backend-types';
import { ScheduledNameEnum } from '../types/ScheduledNameEnum';

const startMinigame = async (roomCode: string, socket: Socket) => {
  await roomRepository.deleteScheduled(roomCode, ScheduledNameEnum.minigames);
  await roomRepository.updateRoomData(roomCode, { status: RoomStatusEnum.game });
  const response = await startMinigameService(roomCode);

  if (!response.success) {
    socket.nsp.to(roomCode).emit('failed_to_start_minigame');
    return;
  }

  // Payload: { minigameData }
  socket.nsp.to(roomCode).emit('started_minigame', response.payload);
};

const startRound = async (roomCode: string, socket: Socket) => {
  const minigameData = await roomRepository.getMinigameData(roomCode);

  console.log('Starting round for game - ', minigameData?.minigameName);
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
      await roomRepository.addScheduled(roomCode, startAt, ScheduledNameEnum.minigames);
      await startMinigameScheduler(socket);
      return;
    }
  });

  socket.on('start_round_queue', async () => {
    const roomCode = socket.data.roomCode;

    //TODO: Change all player to only connected players

    await roomRepository.toggleReady(roomCode, socket.id, ReadyNameEnum.round);
    const playersReady = await roomRepository.getReadyPlayersCount(roomCode, ReadyNameEnum.round);
    const playersIds = await roomRepository.getAllPlayerIds(roomCode);

    // Start round immediately
    if (playersReady === playersIds.length) {
      const started = await roomRepository.acquireLock(roomCode, LockName.round, 10);

      if (!started) {
        console.log('Round already started or scheduled');
        return;
      }

      await startRound(roomCode, socket);
      return;
    }

    // Round will start in 5 seconds
    if (playersReady >= MIN_PLAYERS_TO_START) {
      const started = await roomRepository.acquireLock(roomCode, LockName.round, 10);

      if (!started) {
        console.log('Round already started or scheduled');
        return;
      }

      const startAt = Date.now() + 5000;
      await roomRepository.addScheduled(roomCode, startAt, ScheduledNameEnum.rounds);
      await startRoundScheduler(socket);
      return;
    }
  });
};

//TODO: Merge these two functions

const startRoundScheduler = async (socket: Socket) => {
  while (true) {
    const ready = await roomRepository.getReadyScheduled(ScheduledNameEnum.rounds);

    if (ready.length === 0) {
      const futureRounds = await roomRepository.getScheduled(ScheduledNameEnum.rounds);

      if (futureRounds === 0) {
        console.log('No more scheduled rounds, stopping worker');
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      continue;
    }

    for (const roomCode of ready) {
      const gotLock = await roomRepository.acquireLock(roomCode, LockName.watchRound, 10);

      if (!gotLock) {
        console.log(`Skipping worker for room: ${roomCode}, already being processed`);
        continue;
      }

      try {
        await startRound(roomCode, socket);
      } catch (err) {
        console.error('Failed to start round', err);
      } finally {
        await roomRepository.deleteLock(roomCode, LockName.watchRound);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};

const startMinigameScheduler = async (socket: Socket) => {
  while (true) {
    const ready = await roomRepository.getReadyScheduled(ScheduledNameEnum.minigames);

    if (ready.length === 0) {
      const futureGames = await roomRepository.getScheduled(ScheduledNameEnum.minigames);

      if (futureGames === 0) {
        console.log('No more scheduled minigames, stopping worker');
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      continue;
    }

    for (const roomCode of ready) {
      const gotLock = await roomRepository.acquireLock(roomCode, LockName.watchMinigame, 10);

      if (!gotLock) {
        console.log(`Skipping worker for room: ${roomCode}, already being processed`);
        continue;
      }

      try {
        await startMinigame(roomCode, socket);
      } catch (err) {
        console.error('Failed to start minigame', err);
      } finally {
        await roomRepository.deleteLock(roomCode, LockName.watchMinigame);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};
