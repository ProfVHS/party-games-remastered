import { client } from '../config/db';
import * as roomRepository from '../repositories/roomRepository/roomRepository';
import { IReturnData } from '../types/roomServiceTypes';
import { ChainableCommander } from 'ioredis';
import { TPlayer, EPossibleMinigames, TMinigameData } from '../types/roomRepositoryTypes';
import { clickTheBombConfig } from '../config/minigames';
import { Socket } from 'socket.io';

export const createRoomService = async (roomCode: string, socket: Socket, nickname: string): Promise<IReturnData> => {
  let multi: ChainableCommander;

  try {
    multi = client.multi();
    await roomRepository.setPlayerInPlayers(roomCode, socket.id, nickname, multi);
    await roomRepository.setPlayerInLeaderboard(roomCode, socket.id, multi);
    await multi.exec();
  } catch (error) {
    console.error(`Room creation failed for room ${roomCode} and player: ${nickname}: ${error}`);
    return { success: false }; // Room not created
  }

  return { success: true }; // Room created
};

export const joinRoomService = async (roomCode: string, socket: Socket, nickname: string): Promise<IReturnData> => {
  let players: TPlayer[] | null;
  let multi: ChainableCommander;
  let playerReadyCount: number;

  try {
    players = await roomRepository.getAllPlayersFromPlayers(roomCode);

    if (!players) {
      return { success: false, payload: 0 }; // Room does not exist
    }

    if (Object.keys(players).length >= 8) {
      return { success: false, payload: -1 }; // Room is full
    }

    multi = client.multi();

    await roomRepository.setPlayerInPlayers(roomCode, socket.id, nickname, multi);
    await roomRepository.setPlayerInLeaderboard(roomCode, socket.id, multi);

    await multi.exec();

    playerReadyCount = await roomRepository.getAllReadyPlayerCount(roomCode);
  } catch (error) {
    console.error(`Room joining failed for room ${roomCode} and player: ${socket.id}: ${error}`);
    return { success: false, payload: -100 }; // Room not joined
  }
  return { success: true, payload: playerReadyCount }; // Success and number of players ready
};

export const toggleReadyService = async (roomCode: string, socket: Socket): Promise<IReturnData> => {
  let multi: ChainableCommander;
  let playerReadyCount: number;

  try {
    multi = client.multi();

    const isReady = await roomRepository.isPlayerReady(roomCode, socket.id);

    if (isReady) {
      await roomRepository.setPlayerReady(roomCode, socket.id, false, multi);
    } else {
      await roomRepository.setPlayerReady(roomCode, socket.id, true, multi);
    }

    multi.exec();

    playerReadyCount = await roomRepository.getAllReadyPlayerCount(roomCode);
  } catch (error) {
    console.error(`Player ready status toggle failed for room ${roomCode} and player: ${socket.id}: ${error}`);
    return { success: false }; // Ready status not
  }

  return { success: true, payload: playerReadyCount }; // Success and number of players ready
};

export const deleteRoomService = async (roomCode: string): Promise<IReturnData> => {
  let multi: ChainableCommander;

  try {
    multi = client.multi();

    await roomRepository.deleteLeaderboard(roomCode, multi);
    await roomRepository.deletePlayers(roomCode, multi);
    await roomRepository.deleteIsReady(roomCode, multi);

    await multi.exec();
  } catch (error) {
    console.error(`Room deletion failed for room ${roomCode}: ${error}`);
    return { success: false }; // Room not deleted
  }

  return { success: true }; // Room deleted
};

export const deletePlayerService = async (socket: Socket): Promise<IReturnData> => {
  let multi: ChainableCommander;
  let roomCode: string | null;

  try {
    roomCode = await roomRepository.getRoomCodeFromPlayer(socket.id);

    if (!roomCode) {
      return { success: false }; // Player not deleted
    }

    multi = client.multi();

    await roomRepository.removePlayerFromLeaderboard(roomCode, socket.id, multi);
    await roomRepository.removePlayerFromPlayers(roomCode, socket.id, multi);
    await roomRepository.removePlayerFromReady(roomCode, socket.id, multi);

    await multi.exec();
  } catch (error) {
    console.error(`Player deletion failed for player: ${socket.id}: ${error}`);
    return { success: false }; // Player not deleted
  }

  return { success: true, payload: roomCode }; // Player deleted
};

export const startMinigameService = async (roomCode: string, minigame: EPossibleMinigames): Promise<IReturnData> => {
  let minigameData: TMinigameData | null;

  try {
    switch (minigame) {
      case EPossibleMinigames.clickTheBomb:
        await roomRepository.setMinigame(roomCode, clickTheBombConfig);
        break;
      default:
        console.error("Tried setting game which doesn't exist");
        break;
    }
    minigameData = await roomRepository.getMinigame(roomCode);
  } catch (error) {
    console.error(`Minigame start failed for room ${roomCode}: ${error}`);
    return { success: false }; // Minigame not started
  }

  return { success: true, payload: minigameData }; // Minigame started
};
