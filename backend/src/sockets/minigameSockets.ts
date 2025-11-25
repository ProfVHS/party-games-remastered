import { Socket } from 'socket.io';
import { MinigameNamesEnum, RoomStatusEnum } from '@shared/types';
import { endMinigameService, endRoundService, startMinigameService } from '@minigameService';
import * as roomRepository from '@roomRepository';
import { MIN_PLAYERS_TO_START } from '@shared/constants/gameRules';
import { LockName, ReadyNameEnum, ScheduledNameEnum } from '@backend-types';
import { MinigameEntryType } from '@shared/types/RoomSettingsType';

const startMinigame = async (roomCode: string, socket: Socket) => {
  const response = await startMinigameService(roomCode);

  if (!response.success) {
    socket.nsp.to(roomCode).emit('failed_to_start_minigame');
    return;
  }

  // Payload: { minigameData }
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
    const connectedPlayers = await roomRepository.getFilteredPlayers(roomCode, { isDisconnected: false });

    // Start the minigame immediately
    if (playersReady === connectedPlayers.length) {
      const started = await roomRepository.acquireLock(roomCode, LockName.minigame);

      if (!started) {
        console.log('Minigame already started or scheduled');
        return;
      }

      await startMinigame(roomCode, socket);
      return;
    }

    // The minigame will start in 5 seconds
    if (playersReady >= MIN_PLAYERS_TO_START) {
      const startedCountdown = await roomRepository.acquireLock(roomCode, LockName.countdownMinigame);

      if (!startedCountdown) {
        console.log('Minigame countdown already started or scheduled');
        return;
      }

      const startAt = Date.now() + 5000;
      await roomRepository.addScheduled(roomCode, startAt, ScheduledNameEnum.minigames);
      await startScheduler(socket, ScheduledNameEnum.minigames);
      return;
    }
  });

  socket.on('end_round_queue', async () => {
    const roomCode = socket.data.roomCode;

    await roomRepository.toggleReady(roomCode, socket.id, ReadyNameEnum.round);
    const playersReady = await roomRepository.getReadyPlayersCount(roomCode, ReadyNameEnum.round);
    const connectedPlayers = await roomRepository.getFilteredPlayers(roomCode, { isDisconnected: false });

    // Start round immediately
    if (playersReady === connectedPlayers.length) {
      const started = await roomRepository.acquireLock(roomCode, LockName.round);

      if (!started) {
        console.log('Round already started or scheduled');
        return;
      }

      await endRoundService(roomCode, socket);
      return;
    }

    // Round will start in 5 seconds
    if (playersReady >= MIN_PLAYERS_TO_START) {
      const startedCountdown = await roomRepository.acquireLock(roomCode, LockName.countdownRound);

      if (!startedCountdown) {
        console.log('Round countdown already started or scheduled');
        return;
      }

      const startAt = Date.now() + 5000;
      await roomRepository.addScheduled(roomCode, startAt, ScheduledNameEnum.rounds);
      await startScheduler(socket, ScheduledNameEnum.rounds);
      return;
    }
  });

  socket.on('end_tutorial_queue', async () => {
    const roomCode = socket.data.roomCode;
    const roomData = await roomRepository.getRoomData(roomCode);

    if (!roomData) {
      console.error(`Room not found for room: ${roomCode}`);
      return;
    }

    await roomRepository.toggleReady(roomCode, socket.id, ReadyNameEnum.tutorial);
    const playersReady = await roomRepository.getReadyPlayersCount(roomCode, ReadyNameEnum.tutorial);
    const connectedPlayers = await roomRepository.getFilteredPlayers(roomCode, { isDisconnected: false });

    // Start the minigame immediately
    if (playersReady === connectedPlayers.length) {
      const started = await roomRepository.acquireLock(roomCode, LockName.tutorial, 10);

      if (!started) {
        console.log('Tutorial already ended');
        return;
      }

      setTimeout(async () => {
        try {
          await roomRepository.deleteLock(roomCode, LockName.tutorial);
          await roomRepository.deleteReadyTable(roomCode, ReadyNameEnum.tutorial);
        } catch (err) {
          console.error('Error clearing tutorial lock:', err);
        }
      }, 2000);

      //Change to minigame and close tutorial
      socket.nsp.to(roomCode).emit('ended_tutorial_queue');
    }

    socket.nsp.to(roomCode).emit('tutorial_queue_players', playersReady, connectedPlayers.length);
  });

  socket.on('end_minigame', async () => {
    const roomCode = socket.data.roomCode;
    await endMinigameService(roomCode, socket);
  });
};

// Scheduler that processes ready rooms (starting minigames or ending rounds)
// using a lock mechanism, and automatically stops when no future actions are scheduled
// Room readiness is determined by comparing the current timestamp with the `startAt`
// value stored in a Redis sorted set

const startScheduler = async (socket: Socket, scheduledName: ScheduledNameEnum) => {
  const watchKey = scheduledName === ScheduledNameEnum.minigames ? LockName.watchMinigame : LockName.watchRound;

  while (true) {
    const readyRooms = await roomRepository.getReadyScheduled(scheduledName);

    if (readyRooms.length === 0) {
      const futureRoundsOrGames = await roomRepository.getScheduled(scheduledName);

      if (futureRoundsOrGames === 0) {
        console.log(`No more scheduled for key: ${scheduledName}, stopping worker`);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      continue;
    }

    for (const roomCode of readyRooms) {
      const gotLock = await roomRepository.acquireLock(roomCode, watchKey);

      if (!gotLock) {
        console.log(`Skipping worker for room: ${roomCode}, already being processed`);
        continue;
      }

      try {
        if (scheduledName === ScheduledNameEnum.minigames) {
          await startMinigame(roomCode, socket);
        } else {
          await endRoundService(roomCode, socket);
        }
      } catch (err) {
        console.error(`Failed to start: ${scheduledName}`, err);
      } finally {
        await roomRepository.deleteLock(roomCode, watchKey);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};
