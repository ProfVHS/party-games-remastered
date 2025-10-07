import { client } from '@config/db';
import { ChainableCommander } from 'ioredis';

const keyName = 'scheduled:minigames';

export const addScheduledMinigames = async (roomCode: string, startAt: number, multi?: ChainableCommander): Promise<void> => {
  if (multi) {
    multi.zadd(keyName, startAt, roomCode);
  } else {
    await client.zadd(keyName, startAt, roomCode);
  }
};

export const getScheduledMinigames = async (): Promise<number> => {
  return client.zcard(keyName);
};

export const getReadyScheduledMinigames = async (): Promise<string[]> => {
  const now = Date.now();

  return client.zrangebyscore('scheduled:minigames', 0, now);
};

export const deleteScheduledMinigames = async (roomCode: string, multi?: ChainableCommander): Promise<void> => {
  if (multi) {
    multi.zrem(keyName, roomCode);
  } else {
    await client.zrem(keyName, roomCode);
  }
};
