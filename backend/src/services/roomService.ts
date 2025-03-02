import { client } from '../config/db';
import * as roomRepository from '../repositories/roomRepository/roomRepository';
import { IReturnData } from '../interfaces/roomServiceInterfaces';
import { ChainableCommander } from 'ioredis';
import { IPlayer } from '../interfaces/roomRepositoryInterfaces';

export const createRoomService = async (roomCode: string, nickname: string): Promise<IReturnData> => {
  let multi: ChainableCommander;

  try {
    multi = client.multi();
    await roomRepository.setPlayerInPlayers(roomCode, nickname, multi);
    await roomRepository.setRoomStatus(roomCode, multi);
    await roomRepository.setPlayerInLeaderboard(roomCode, nickname, multi);
    await multi.exec();
  } catch (error) {
    console.error(`Room creation failed for room ${roomCode} and player: ${nickname}: ${error}`);
    return { success: false }; // Room not created
  }

  return { success: true }; // Room created
};

export const joinRoomService = async (roomCode: string, nickname: string): Promise<IReturnData> => {
  let players: IPlayer[] | null;
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

    await roomRepository.setPlayerInPlayers(roomCode, nickname, multi);
    await roomRepository.setPlayerInLeaderboard(roomCode, nickname, multi);

    await multi.exec();

    playerReadyCount = await roomRepository.getAllReadyPlayerCount(roomCode);
  } catch (error) {
    console.error(`Room joining failed for room ${roomCode} and player: ${nickname}: ${error}`);
    return { success: false }; // Room not joined
  }

  return { success: true, payload: playerReadyCount }; // Success and number of players ready
};

export const toggleReadyService = async (roomCode: string, nickname: string): Promise<IReturnData> => {
  let multi: ChainableCommander;
  let playerReadyCount: number;

  try {
    multi = client.multi();

    const isReady = await roomRepository.isPlayerReady(roomCode, nickname);

    if (isReady) {
      await roomRepository.setPlayerReady(roomCode, nickname, false, multi);
    } else {
      await roomRepository.setPlayerReady(roomCode, nickname, true, multi);
    }

    multi.exec();

    playerReadyCount = await roomRepository.getAllReadyPlayerCount(roomCode);
  } catch (error) {
    console.error(`Player ready status toggle failed for room ${roomCode} and player: ${nickname}: ${error}`);
    return { success: false }; // Ready status not
  }

  return { success: true, payload: playerReadyCount }; // Success and number of players ready
};

export const deleteRoomService = async (roomCode: string): Promise<IReturnData> => {
  let multi: ChainableCommander;

  try {
    multi = client.multi();

    await roomRepository.deleteLeaderboard(roomCode, multi);
    await roomRepository.deleteRoomStatus(roomCode, multi);
    await roomRepository.deletePlayers(roomCode, multi);
    await roomRepository.deleteIsReady(roomCode, multi);

    await multi.exec();
  } catch (error) {
    console.error(`Room deletion failed for room ${roomCode}: ${error}`);
    return { success: false }; // Room not deleted
  }

  return { success: true }; // Room deleted
};
