import { client } from '../../config/db';
import { ChainableCommander } from 'ioredis';
import { MinigameNamesEnum } from '../../types/roomRepositoryTypes';
import { getKey } from './roomRepository';

const keyName = 'minigames';

export const setMinigames = async (roomCode: string, minigames: MinigameNamesEnum[], multi?: ChainableCommander): Promise<void> => {
  if (multi) {
    multi.del(getKey(roomCode, keyName));
    minigames.forEach((minigame) => multi.rpush(getKey(roomCode, keyName), minigame));
  } else {
    await client.del(getKey(roomCode, keyName));
    for (const minigame of minigames) {
      await client.rpush(getKey(roomCode, keyName), minigame);
    }
  }
};

export const getMinigames = async (roomCode: string): Promise<MinigameNamesEnum[] | null> => {
  const data = await client.lrange(getKey(roomCode, keyName), 0, -1);
  return data.length > 0 ? (data as MinigameNamesEnum[]) : null;
};

export const deleteMinigames = async (roomCode: string, multi?: ChainableCommander): Promise<void> => {
  if (multi) {
    multi.del(getKey(roomCode, keyName));
  } else {
    await client.del(getKey(roomCode, keyName));
  }
};
