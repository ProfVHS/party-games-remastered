import { Socket } from 'socket.io';
import { MinigameNamesEnum, RoomStatusEnum } from '@shared/types';
import { startMinigameService } from '@minigameService';
import * as roomRepository from '@roomRepository';
import { deleteScheduled } from '@roomRepository';
import { MIN_PLAYERS_TO_START } from '@shared/constants/gameRules';
import { LockName, ReadyNameEnum, ScheduledNameEnum } from '@backend-types';
import { cardsRound } from './cardsSockets';

const startMinigame = async (roomCode: string, socket: Socket) => {
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
  await deleteScheduled(roomCode, ScheduledNameEnum.rounds);
  //TODO: Reset ready table
  //TODO: make it roundservice

  switch (minigameData?.minigameName) {
    case MinigameNamesEnum.cards:
      console.log('Starintg cards round');
      await cardsRound(socket);
      break;
    default:
      console.error('Tried start round for non existing game: ', minigameData?.minigameName);
      break;
  }

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
    const connectedPlayers = await roomRepository.getFilteredPlayers(roomCode, { isDisconnected: 'false' });

    // Start the minigame immediately
    if (playersReady === connectedPlayers.length) {
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
      const startedCountdown = await roomRepository.acquireLock(roomCode, LockName.countdownMinigame, 10);

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

  socket.on('start_round_queue', async () => {
    const roomCode = socket.data.roomCode;

    await roomRepository.toggleReady(roomCode, socket.id, ReadyNameEnum.round);
    const playersReady = await roomRepository.getReadyPlayersCount(roomCode, ReadyNameEnum.round);
    const connectedPlayers = await roomRepository.getFilteredPlayers(roomCode, { isDisconnected: 'false' });

    console.log('Players ready - ', playersReady);
    console.log('Players connected - ', connectedPlayers.length);

    // Start round immediately
    if (playersReady === connectedPlayers.length) {
      console.log('Started od razu');
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
      console.log('Zaczynam za 5 sekund');
      const startedCountdown = await roomRepository.acquireLock(roomCode, LockName.countdownRound, 10);

      //TODO: Change it e.g. to another key, it will stop because there is queue and we want to stop it and start the game immediately
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
};

const startScheduler = async (socket: Socket, scheduledName: ScheduledNameEnum) => {
  const watchKey = scheduledName === ScheduledNameEnum.minigames ? LockName.watchMinigame : LockName.watchRound;

  while (true) {
    const ready = await roomRepository.getReadyScheduled(scheduledName);

    if (ready.length === 0) {
      const futureRoundsOrGames = await roomRepository.getScheduled(scheduledName);

      if (futureRoundsOrGames === 0) {
        console.log(`No more scheduled for key: ${scheduledName}, stopping worker`);
        return;
      }

      console.log("Future games - ", futureRoundsOrGames);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      continue;
    }

    for (const roomCode of ready) {
      const gotLock = await roomRepository.acquireLock(roomCode, watchKey, 10);

      if (!gotLock) {
        console.log(`Skipping worker for room: ${roomCode}, already being processed`);
        continue;
      }

      try {
        if (scheduledName === ScheduledNameEnum.minigames) {
          await startMinigame(roomCode, socket);
        } else {
          await startRound(roomCode, socket);
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
