import { client } from '@config/db';
import { Socket } from 'socket.io';
import * as roomRepository from '@roomRepository';
import { ChainableCommander } from 'ioredis';
import { PlayerStatusEnum, ReturnDataType, RoomDataType, RoomStatusEnum } from '@shared/types';
import { MIN_PLAYERS_TO_START } from '@shared/constants/gameRules';
import { avatars } from '@shared/constants/avatars';
import { ReadyNameEnum } from '@backend-types';

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
      isDisconnected: 'false',
      status: PlayerStatusEnum.idle,
      selectedObjectId: '-100',
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
    });
  } catch (error) {
    console.error(`Room creation failed for room ${roomCode} and player: ${playerID}: ${error}`);
    return { success: false }; // Room not created
  }

  return { success: true }; // Room created
};

export const joinRoomService = async (roomCode: string, socket: Socket, nickname: string, storageId: string): Promise<ReturnDataType> => {
  const playerID = socket.id;
  let playersIds: string[] | null;
  let roomData: RoomDataType | null;
  let playersReady: string[] | null;

  try {
    playersIds = await roomRepository.getAllPlayerIds(roomCode);
    roomData = await roomRepository.getRoomData(roomCode);
    playersReady = await roomRepository.getReadyPlayers(roomCode, ReadyNameEnum.minigame);

    const players = await roomRepository.getAllPlayers(roomCode);
    const existingAvatars = players.map((p) => p.avatar);
    const availableAvatars = avatars.filter((avatar) => !existingAvatars.includes(avatar));

    if (playersIds.length === 0) {
      return { success: false, payload: -1 }; // Room does not exist
    }

    if (Object.keys(playersIds).length >= 8) {
      return { success: false, payload: -2 }; // Room is full
    }

    if (roomData?.status === RoomStatusEnum.game) {
      if (!playersIds.includes(storageId)) return { success: false, payload: -3 }; // Room is in game
    }

    if (playersIds.length === playersReady.length && playersIds.length >= MIN_PLAYERS_TO_START) {
      return { success: false, payload: -4 }; // Room is starting the game
    }

    await roomRepository.createPlayer(roomCode, playerID, {
      id: playerID,
      nickname,
      isAlive: 'true',
      score: '0',
      isHost: 'false',
      isDisconnected: 'false',
      status: PlayerStatusEnum.idle,
      selectedObjectId: '-100',
      avatar: availableAvatars[Math.floor(Math.random() * availableAvatars.length)],
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
  let playersReady: string[];

  try {
    await roomRepository.toggleReady(roomCode, playerID, ReadyNameEnum.minigame);

    playersReady = await roomRepository.getReadyPlayers(roomCode, ReadyNameEnum.minigame);
  } catch (error) {
    console.error(`Player ready status toggle failed for room ${roomCode} and player: ${playerID}: ${error}`);
    return { success: false }; // Ready status not
  }

  return { success: true, payload: playersReady }; // Success and ids array of players ready
};

export const deleteRoomService = async (socket: Socket): Promise<ReturnDataType> => {
  const roomCode = socket.data.roomCode;
  let multi: ChainableCommander;

  try {
    multi = client.multi();
    await roomRepository.deleteAllPlayers(roomCode, multi);
    await roomRepository.deleteReadyTable(roomCode, ReadyNameEnum.minigame, multi); // In case room gets deleted before first minigame starts
    await roomRepository.deleteRoomData(roomCode, multi);
    await roomRepository.deleteRoomSettings(roomCode, multi);

    await multi.exec();
  } catch (error) {
    console.error(`Room deletion failed for room ${roomCode}: ${error}`);
    return { success: false }; // Room not deleted
  }

  return { success: true }; // Room deleted
};
