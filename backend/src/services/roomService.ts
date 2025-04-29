import { client } from '../config/db';
import * as roomRepository from '../repositories/roomRepository/roomRepository';
import { IReturnData } from '../types/roomServiceTypes';
import { ChainableCommander } from 'ioredis';
import { PlayerType, MinigamesEnum, GameRoomDataType } from '../types/roomRepositoryTypes';
import { clickTheBombConfig } from '../config/minigames';
import { Socket } from 'socket.io';

export const createRoomService = async (roomCode: string, socket: Socket, nickname: string): Promise<IReturnData> => {
  const playerID = socket.id;
  socket.data.roomCode = roomCode;
  try {
    await roomRepository.createPlayer(roomCode, playerID, { nickname, isAlive: true, score: 0 });
  } catch (error) {
    console.error(`Room creation failed for room ${roomCode} and player: ${playerID}: ${error}`);
    return { success: false }; // Room not created
  }

  return { success: true }; // Room created
};

export const joinRoomService = async (roomCode: string, socket: Socket, nickname: string): Promise<IReturnData> => {
  const playerID = socket.id;
  let players: PlayerType[] | null;
  let playerReadyCount: number;

  try {
    players = await roomRepository.getAllPlayers(roomCode);

    if (!players) {
      return { success: false, payload: 0 }; // Room does not exist
    }

    if (Object.keys(players).length >= 8) {
      return { success: false, payload: -1 }; // Room is full
    }

    await roomRepository.createPlayer(roomCode, playerID, { nickname, isAlive: true, score: 0 });

    playerReadyCount = await roomRepository.getReadyPlayersCount(roomCode);
    socket.data.roomCode = roomCode;
  } catch (error) {
    console.error(`Room joining failed for room ${roomCode} and player: ${playerID}: ${error}`);
    return { success: false, payload: -100 }; // Room not joined
  }
  return { success: true, payload: playerReadyCount }; // Success and number of players ready
};

export const toggleReadyService = async (socket: Socket): Promise<IReturnData> => {
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

export const deletePlayerService = async (socket: Socket): Promise<IReturnData> => {
  const playerID = socket.id;
  const roomCode = socket.data.roomCode;
  let multi: ChainableCommander;

  try {
    multi = client.multi();

    await roomRepository.deletePlayer(roomCode, playerID, multi);
    await roomRepository.deletePlayerFromReady(roomCode, playerID, multi);

    await multi.exec();
  } catch (error) {
    console.error(`Player deletion failed for player: ${playerID}: ${error}`);
    return { success: false }; // Player not deleted
  }

  return { success: true }; // Player deleted
};

export const deleteRoomService = async (socket: Socket): Promise<IReturnData> => {
  const roomCode = socket.data.roomCode;
  let multi: ChainableCommander;

  try {
    multi = client.multi();

    await roomRepository.deleteAllPlayers(roomCode, multi);
    await roomRepository.deleteReady(roomCode, multi); // In case room gets deleted before first minigame starts

    await multi.exec();
  } catch (error) {
    console.error(`Room deletion failed for room ${roomCode}: ${error}`);
    return { success: false }; // Room not deleted
  }

  return { success: true }; // Room deleted
};

export const startMinigameService = async (roomCode: string, minigame: MinigamesEnum): Promise<IReturnData> => {
  let minigameData: GameRoomDataType | null;

  try {
    switch (minigame) {
      case MinigamesEnum.clickTheBomb:
        await roomRepository.setGameRoom(roomCode, clickTheBombConfig);
        break;
      default:
        console.error("Tried setting game which doesn't exist");
        break;
    }
    minigameData = await roomRepository.getGameRoom(roomCode);
    await roomRepository.deleteReady(roomCode); // We don't need it after the game has started
  } catch (error) {
    console.error(`Minigame start failed for room ${roomCode}: ${error}`);
    return { success: false }; // Minigame not started
  }

  return { success: true, payload: minigameData }; // Minigame started
};
