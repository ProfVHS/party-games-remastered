import { client } from '@config/db';
import { Socket } from 'socket.io';
import { ChainableCommander } from 'ioredis';
import * as roomRepository from '@roomRepository';
import { MinigameDataType, MinigameNamesEnum, PlayerStatusEnum, ReturnDataType, RoomStatusEnum, TurnType } from '@shared/types';
import { createCardsConfig, createClickTheBombConfig, createColorsMemoryConfig, createRoomConfig, createTrickyDiamondsConfig } from '@config/minigames';
import { cardsRound, trickyDiamondsRound } from '@sockets';
import { LockName, ReadyNameEnum, ScheduledNameEnum } from '@backend-types';

export const startMinigameService = async (roomCode: string): Promise<ReturnDataType> => {
  let minigameData: MinigameDataType | null = null;
  let multi: ChainableCommander;
  const players = await roomRepository.getAllPlayers(roomCode);
  const roomData = await roomRepository.getRoomData(roomCode);
  const roomSettings = await roomRepository.getRoomSettings(roomCode);
  const minigames = roomSettings?.minigames ?? [];

  if (!players || players.length === 0) {
    console.error(`No players found in room ${roomCode} for starting minigame`);
    return { success: false }; // No players to start the minigame
  }

  if (minigames.length === 0) {
    throw new Error(`Couldn't find minigames for room ${roomCode} when starting a game`);
  }

  if (!roomData) {
    throw new Error(`Couldn't find roomData for room ${roomCode} when starting a game`);
  }

  const currentMinigame = minigames[roomData?.minigameIndex]?.name;

  console.log(`Current minigame: ${currentMinigame}`);

  try {
    multi = client.multi();
    await roomRepository.updateRoomData(roomCode, createRoomConfig(players.length, RoomStatusEnum.game), multi);
    await roomRepository.deleteScheduled(roomCode, ScheduledNameEnum.minigames);

    switch (currentMinigame) {
      case MinigameNamesEnum.clickTheBomb:
        const clickTheBombConfig = createClickTheBombConfig(players.length);
        minigameData = clickTheBombConfig;
        console.log(`Starting Click The Bomb minigame in room ${roomCode} with config:`, clickTheBombConfig);
        await roomRepository.setMinigameData(roomCode, clickTheBombConfig, multi);
        break;
      case MinigameNamesEnum.cards:
        const cardsConfig = createCardsConfig();
        minigameData = cardsConfig;
        console.log(`Starting Cards minigame in room ${roomCode} with config:`, cardsConfig);
        await roomRepository.setMinigameData(roomCode, cardsConfig, multi);
        break;
      case MinigameNamesEnum.colorsMemory:
        const colorsMemoryConfig = createColorsMemoryConfig();
        minigameData = colorsMemoryConfig;
        console.log(`Starting Colors Memory minigame in room ${roomCode} with config:`, colorsMemoryConfig);
        await roomRepository.setMinigameData(roomCode, colorsMemoryConfig, multi);
        break;
      case MinigameNamesEnum.trickyDiamonds:
        const trickyDiamondConfig = createTrickyDiamondsConfig();
        minigameData = trickyDiamondConfig;
        console.log(`Starting Tricky Diamonds minigame in room ${roomCode} with config:`, trickyDiamondConfig);
        await roomRepository.setMinigameData(roomCode, trickyDiamondConfig, multi);
        break;
      default:
        console.error("Tried setting game which doesn't exist");
        break;
    }
    await multi.exec();

    await roomRepository.deleteReadyTable(roomCode, ReadyNameEnum.minigame); // We don't need it after the game has started
  } catch (error) {
    console.error(`Minigame start failed for room ${roomCode}: ${error}`);
    return { success: false }; // Minigame not started
  }

  return { success: true, payload: { minigameData } }; // Minigame started
};

export const endMinigameService = async (roomCode: string, socket: Socket) => {
  let multi: ChainableCommander;

  try {
    multi = client.multi();

    await roomRepository.updateFilteredPlayers(
      roomCode,
      { isDisconnected: false },
      {
        isAlive: true,
        status: PlayerStatusEnum.idle,
        selectedObjectId: -100,
      },
      multi,
    );
    await roomRepository.updateRoomData(roomCode, { status: RoomStatusEnum.leaderboard }, multi);
    await roomRepository.incrementRoomDataMinigameIndex(roomCode, multi);
    await roomRepository.deleteReadyTable(roomCode, ReadyNameEnum.minigame, multi);
    await roomRepository.deleteLock(roomCode, LockName.minigame, multi);

    await multi.exec();

    const players = await roomRepository.getAllPlayers(roomCode);
    socket.nsp.to(roomCode).emit('ended_minigame', players);
  } catch (error) {
    throw new Error(`Failed to end minigame for room ${roomCode}: ${error}`);
  }
};

export const startRoundService = async (roomCode: string, socket: Socket) => {
  const minigameData = await roomRepository.getMinigameData(roomCode);
  let multi: ChainableCommander;

  if (!minigameData) {
    console.error("Couldn't find minigame data.");
  }

  try {
    multi = client.multi();
    await roomRepository.deleteScheduled(roomCode, ScheduledNameEnum.rounds);
    await roomRepository.deleteReadyTable(roomCode, ReadyNameEnum.round);

    switch (minigameData?.minigameName) {
      case MinigameNamesEnum.cards:
        await cardsRound(socket);
        break;
      case MinigameNamesEnum.trickyDiamonds:
        await trickyDiamondsRound(socket);
        break;
      default:
        console.error('Tried start round for non existing game: ', minigameData?.minigameName);
        break;
    }

    await multi.exec();
  } catch (error) {
    console.error(`Round start failed for room ${roomCode}: ${error}`);
    return { success: false }; // Minigame not started
  }
};

export const changeTurnService = async (roomCode: string): Promise<TurnType | null> => {
  const players = await roomRepository.getAllPlayers(roomCode);
  const roomData = await roomRepository.getRoomData(roomCode);

  if (!roomData) {
    throw new Error(`Room data not found for room: ${roomCode}`);
  }

  if (!players) {
    throw new Error(`Players not found for room: ${roomCode}`);
  }

  let currentTurn = roomData.currentTurn;

  for (let i = 1; i <= players.length; i++) {
    const nextTurn = (currentTurn + i) % players.length;
    const potentialPlayer = players[nextTurn];

    if (potentialPlayer.isAlive && !potentialPlayer.isDisconnected) {
      await roomRepository.updateRoomData(roomCode, { currentTurn: nextTurn });
      return { id: nextTurn, player_id: potentialPlayer.id, nickname: potentialPlayer.nickname };
    }
  }

  throw new Error(`No suitable player found to change turn for room "${roomCode}".`);
};
