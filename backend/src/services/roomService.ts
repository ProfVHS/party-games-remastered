import { client } from '@config/db';
import * as roomRepository from '@roomRepository';
import { ChainableCommander } from 'ioredis';
import { ReturnDataType } from '../types/roomServiceTypes';
import { MinigameNamesEnum, RoomDataType, MinigameDataType, PlayerStatusEnum, RoomStatusEnum } from '@shared/types';
import { createRoomConfig, createClickTheBombConfig, createCardsConfig, createColorsMemoryConfig } from '@config/minigames';
import { Socket } from 'socket.io';
import { MIN_PLAYERS_TO_START } from '@shared/constants/game';

export const createRoomService = async (roomCode: string, socket: Socket, nickname: string): Promise<ReturnDataType> => {
  const playerID = socket.id;
  socket.data.roomCode = roomCode;

  try {
    await roomRepository.createPlayer(roomCode, playerID, {
      id: playerID,
      nickname,
      isAlive: 'true',
      score: '0',
      isHost: 'true',
      status: PlayerStatusEnum.onilne,
      selectedObjectId: '-100',
    });
  } catch (error) {
    console.error(`Room creation failed for room ${roomCode} and player: ${playerID}: ${error}`);
    return { success: false }; // Room not created
  }

  return { success: true }; // Room created
};

export const joinRoomService = async (roomCode: string, socket: Socket, nickname: string, storageId: string): Promise<ReturnDataType> => {
  const playerID = socket.id;
  let players: string[] | null;
  let roomData: RoomDataType | null;
  let playersReady: string[] | null;

  try {
    players = await roomRepository.getAllPlayerIds(roomCode);
    roomData = await roomRepository.getRoomData(roomCode);
    playersReady = await roomRepository.getReadyPlayers(roomCode);

    if (players.length === 0) {
      return { success: false, payload: -1 }; // Room does not exist
    }

    if (Object.keys(players).length >= 8) {
      return { success: false, payload: -2 }; // Room is full
    }

    if (roomData?.status === RoomStatusEnum.game) {
      if (!players.includes(storageId)) return { success: false, payload: -3 }; // Room is in game
    }

    if (players.length === playersReady.length && players.length >= MIN_PLAYERS_TO_START) {
      console.log('Game is starting, cannot join now', players.length, playersReady.length, MIN_PLAYERS_TO_START);
      return { success: false, payload: -4 }; // Room is starting the game
    }

    await roomRepository.createPlayer(roomCode, playerID, {
      id: playerID,
      nickname,
      isAlive: 'true',
      score: '0',
      isHost: 'false',
      status: PlayerStatusEnum.onilne,
      selectedObjectId: '-100',
    });

    socket.data.roomCode = roomCode;
  } catch (error) {
    console.error(`Room joining failed for room ${roomCode} and player: ${playerID}: ${error}`);
    return { success: false, payload: -100 }; // Room not joined
  }
  return { success: true }; // Success join room
};

export const toggleReadyService = async (socket: Socket): Promise<ReturnDataType> => {
  const playerID = socket.id;
  const roomCode = socket.data.roomCode;
  let playerReadyCount: number;

  try {
    await roomRepository.toggleReady(roomCode, playerID);

    playerReadyCount = await roomRepository.getReadyPlayersCount(roomCode);
  } catch (error) {
    console.error(`Player ready status toggle failed for room ${roomCode} and player: ${playerID}: ${error}`);
    return { success: false }; // Ready status not
  }

  return { success: true, payload: playerReadyCount }; // Success and number of players ready
};

export const deletePlayerService = async (socket: Socket): Promise<ReturnDataType> => {
  const playerID = socket.id;
  const roomCode = socket.data.roomCode;
  let multi: ChainableCommander;

  try {
    multi = client.multi();

    await roomRepository.deletePlayer(roomCode, playerID, multi);
    await roomRepository.deletePlayerFromReadyTable(roomCode, playerID, multi);

    await multi.exec();

    const players = await roomRepository.getAllPlayers(roomCode);
    if (players.length === 0) return { success: true, payload: 1 }; // Last player in room
  } catch (error) {
    console.error(`Player deletion failed for player: ${playerID}: ${error}`);
    return { success: false }; // Player not deleted
  }

  return { success: true, payload: 0 }; // Player deleted
};

export const deleteRoomService = async (socket: Socket): Promise<ReturnDataType> => {
  const roomCode = socket.data.roomCode;
  let multi: ChainableCommander;

  try {
    multi = client.multi();
    await roomRepository.deleteAllPlayers(roomCode, multi);
    await roomRepository.deleteReadyTable(roomCode, multi); // In case room gets deleted before first minigame starts
    await roomRepository.deleteRoomData(roomCode, multi);

    await multi.exec();
  } catch (error) {
    console.error(`Room deletion failed for room ${roomCode}: ${error}`);
    return { success: false }; // Room not deleted
  }

  return { success: true }; // Room deleted
};

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
        const clickTheBombConfig = createClickTheBombConfig();
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
