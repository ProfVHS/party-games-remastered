import { client } from '@config/db';
import { ChainableCommander } from 'ioredis';
import { getKey } from '@roomRepository';

const keyName = 'minigameStarted';

export const isMinigameStarted = async (roomCode: string): Promise<boolean> => {
  const response = await client.setnx(getKey(roomCode, keyName), '1');
  return response === 1;
};

export const deleteMinigameStarted = async (roomCode: string, multi?: ChainableCommander): Promise<void> => {
  if (multi) {
    multi.del(getKey(roomCode, keyName));
  } else {
    await client.del(getKey(roomCode, keyName));
  }
};
