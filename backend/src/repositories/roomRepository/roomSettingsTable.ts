import { RoomSettingsType } from '@shared/types/RoomSettingsType';
import { client } from '@config/db';
import { ChainableCommander } from 'ioredis';
import { getKey } from './index';

const keyName = 'roomSettings';

export const setRoomSettings = async (roomCode: string, roomSettings: RoomSettingsType, multi?: ChainableCommander): Promise<void> => {
  const data = {
    ...roomSettings,
    roomCode,
  };

  if (multi) {
    multi.hset(getKey(roomCode, keyName), data);
  } else {
    await client.hset(getKey(roomCode, keyName), data);
  }
};

export const updateRoomSettings = async (roomCode: string, updates: Partial<RoomSettingsType>, multi?: ChainableCommander): Promise<void> => {
  const updatedData = { ...updates };

  for (let [field, value] of Object.entries(updatedData)) {
    const data = typeof value === 'boolean' ? value.toString() : Array.isArray(value) ? JSON.stringify(value) : value;
    if (multi) {
      multi.hset(getKey(roomCode, keyName), field, data);
    } else {
      await client.hset(getKey(roomCode, keyName), field, data);
    }
  }
};

export const getRoomSettings = async (roomCode: string): Promise<RoomSettingsType | null> => {
  const data = await client.hgetall(getKey(roomCode, keyName));

  if (!data || Object.keys(data).length === 0) return null;

  return {
    isRandomMinigames: data.isRandomMinigames === 'true',
    isTutorialsEnabled: data.isTutorialsEnabled === 'true',
    minigames: data.minigames ? JSON.parse(data.minigames) : [],
    numberOfMinigames: Number(data.numberOfMinigames),
  };
};

export const deleteRoomSettings = async (roomCode: string, multi?: ChainableCommander): Promise<void> => {
  if (multi) {
    multi.del(getKey(roomCode, keyName));
  } else {
    await client.del(getKey(roomCode, keyName));
  }
};
