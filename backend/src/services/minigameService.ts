import { client } from '@config/db';
import { Socket } from 'socket.io';
import { ChainableCommander } from 'ioredis';
import * as roomRepository from '@roomRepository';
import { MinigameDataType, MinigameNamesEnum, PlayerStatusEnum, ReturnDataType, RoomStatusEnum, TurnType } from '@shared/types';
import { createCardsConfig, createClickTheBombConfig, createColorsMemoryConfig, createRoomConfig } from '@config/minigames';
import { sendAllPlayers } from '@sockets';

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

  const currentMinigame = minigames[Number(roomData?.minigameIndex)]?.name;

  try {
    multi = client.multi();
    await roomRepository.updateRoomData(roomCode, createRoomConfig(players.length, RoomStatusEnum.game), multi);

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
      default:
        console.error("Tried setting game which doesn't exist");
        break;
    }
    await multi.exec();

    await roomRepository.deleteReadyTable(roomCode); // We don't need it after the game has started
  } catch (error) {
    console.error(`Minigame start failed for room ${roomCode}: ${error}`);
    return { success: false }; // Minigame not started
  }

  return { success: true, payload: { roomData, minigameData } }; // Minigame started
};

export const endMinigameService = async (roomCode: string, socket: Socket) => {
  let multi: ChainableCommander;

  try {
    multi = client.multi();

    await roomRepository.updateFilteredPlayers(
      roomCode,
      { isDisconnected: 'false' },
      { isAlive: 'true', status: PlayerStatusEnum.idle, selectedObjectId: '-100' },
      multi,
    );
    await roomRepository.updateRoomData(roomCode, { status: RoomStatusEnum.leaderboard }, multi);
    await roomRepository.incrementRoomDataMinigameIndex(roomCode, multi);
    await roomRepository.deleteReadyTable(roomCode, multi);
    await roomRepository.deleteMinigameStarted(roomCode, multi);

    await multi.exec();

    await sendAllPlayers(socket, roomCode);
    socket.nsp.to(roomCode).emit('ended_minigame');
  } catch (error) {
    throw new Error(`Failed to end minigame for room ${roomCode}: ${error}`);
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

  let currentTurn = Number(roomData.currentTurn);

  for (let i = 1; i <= players.length; i++) {
    const nextTurn = (currentTurn + i) % players.length;
    const potentialPlayer = players[nextTurn];

    if (potentialPlayer.isAlive === 'true' && potentialPlayer.isDisconnected === 'false') {
      await roomRepository.updateRoomData(roomCode, { currentTurn: nextTurn.toString() });
      return { id: nextTurn, player_id: potentialPlayer.id, nickname: potentialPlayer.nickname };
    }
  }

  throw new Error(`No suitable player found to change turn for room "${roomCode}".`);
};
