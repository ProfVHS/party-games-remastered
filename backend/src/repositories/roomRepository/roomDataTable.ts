import { client } from '@config/db';
import { ChainableCommander } from 'ioredis';
import { RoomDataType } from '@shared/types';
import { getKey } from '@roomRepository';

const keyName = 'roomData';

export const setRoomData = async (roomCode: string, roomData: RoomDataType, multi?: ChainableCommander): Promise<void> => {
  roomData = {
    ...roomData,
    roomCode,
  };

  if (multi) {
    multi.hset(getKey(roomCode, keyName), roomData);
  } else {
    await client.hset(getKey(roomCode, keyName), roomData);
  }
};

export const updateRoomData = async (roomCode: string, updates: Partial<RoomDataType>, multi?: ChainableCommander): Promise<void> => {
  const updatedData = { ...updates };

  for (const [field, value] of Object.entries(updatedData)) {
    if (multi) {
      multi.hset(getKey(roomCode, keyName), field, value);
    } else {
      await client.hset(getKey(roomCode, keyName), field, value);
    }
  }
};

export const getRoomData = async (roomCode: string): Promise<RoomDataType | null> => {
  const roomData = await client.hgetall(getKey(roomCode, keyName));

  if (!roomData || Object.keys(roomData).length === 0) return null;

  return roomData as RoomDataType;
};

export const deleteRoomData = async (roomCode: string, multi?: ChainableCommander) => {
  if (multi) {
    multi.del(getKey(roomCode, keyName));
  } else {
    await client.del(getKey(roomCode, keyName));
  }
};

export const incrementRoomDataMinigameIndex = async (roomCode: string, multi?: ChainableCommander) => {
  if (multi) {
    multi.hincrby(getKey(roomCode, keyName), 'minigameIndex', 1);
  } else {
    client.hincrby(getKey(roomCode, keyName), 'minigameIndex', 1);
  }
};
