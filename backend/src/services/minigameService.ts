import { client } from '@config/db';
import * as roomRepository from '@roomRepository';
import { ChainableCommander } from 'ioredis';
import { ReturnDataType } from '@shared/types';
import { MinigameNamesEnum, RoomDataType, MinigameDataType, RoomStatusEnum } from '@shared/types';
import { createRoomConfig, createClickTheBombConfig, createCardsConfig, createColorsMemoryConfig } from '@config/minigames';

export const startMinigameService = async (roomCode: string, minigameName: MinigameNamesEnum): Promise<ReturnDataType> => {
  let roomData: RoomDataType | null;
  let minigameData: MinigameDataType | null;
  let multi: ChainableCommander;
  const players = await roomRepository.getAllPlayers(roomCode);

  if (!players || players.length === 0) {
    console.error(`No players found in room ${roomCode} for starting minigame`);
    return { success: false }; // No players to start the minigame
  }

  try {
    multi = client.multi();
    await roomRepository.setRoomData(roomCode, createRoomConfig(players.length, RoomStatusEnum.game), multi);

    switch (minigameName) {
      case MinigameNamesEnum.clickTheBomb:
        const clickTheBombConfig = createClickTheBombConfig(players.length);
        console.log(`Starting Click The Bomb minigame in room ${roomCode} with config:`, clickTheBombConfig);
        await roomRepository.setMinigameData(roomCode, clickTheBombConfig, multi);
        break;
      case MinigameNamesEnum.cards:
        const cardsConfig = createCardsConfig();
        console.log(`Starting Cards minigame in room ${roomCode} with config:`, cardsConfig);
        await roomRepository.setMinigameData(roomCode, cardsConfig, multi);
        break;
      case MinigameNamesEnum.colorsMemory:
        const colorsMemoryConfig = createColorsMemoryConfig();
        console.log(`Starting Colors Memory minigame in room ${roomCode} with config:`, colorsMemoryConfig);
        await roomRepository.setMinigameData(roomCode, colorsMemoryConfig, multi);
        break;
      default:
        console.error("Tried setting game which doesn't exist");
        break;
    }
    await multi.exec();

    roomData = await roomRepository.getRoomData(roomCode);
    minigameData = await roomRepository.getMinigameData(roomCode);
    await roomRepository.deleteReadyTable(roomCode); // We don't need it after the game has started
  } catch (error) {
    console.error(`Minigame start failed for room ${roomCode}: ${error}`);
    return { success: false }; // Minigame not started
  }

  return { success: true, payload: { roomData, minigameData } }; // Minigame started
};

export const changeTurnService = async (roomCode: string): Promise<string | null> => {
  const players = await roomRepository.getAllPlayers(roomCode);
  const roomData = await roomRepository.getRoomData(roomCode);

  if (!roomData) {
    throw new Error(`Room data not found for room: ${roomCode}`);
  }

  if (!players) {
    throw new Error(`Players not found for room: ${roomCode}`);
  }

  let currentTurn = parseInt(roomData.currentTurn);

  for (let i = 1; i <= players.length; i++) {
    const nextTurn = (currentTurn + i) % players.length;
    const potentialPlayer = players[nextTurn];

    if (potentialPlayer.isAlive === 'true' && potentialPlayer.isDisconnected === 'false') {
      await roomRepository.updateRoomData(roomCode, { currentTurn: nextTurn.toString() });
      return potentialPlayer.nickname;
    }
  }

  throw new Error(`No suitable player found to change turn for room "${roomCode}".`);
};
