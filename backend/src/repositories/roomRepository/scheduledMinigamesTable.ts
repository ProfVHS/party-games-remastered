import { client } from '@config/db';
import { ChainableCommander } from 'ioredis';
import { ScheduledNameEnum } from '@backend-types';

export const addScheduled = async (roomCode: string, startAt: number, keyName: ScheduledNameEnum, multi?: ChainableCommander): Promise<void> => {
  if (multi) {
    multi.zadd(keyName, startAt, roomCode);
  } else {
    await client.zadd(keyName, startAt, roomCode);
  }
};

export const getScheduled = async (keyName: ScheduledNameEnum): Promise<number> => {
  return client.zcard(keyName);
};

export const getReadyScheduled = async (keyName: ScheduledNameEnum): Promise<string[]> => {
  const now = Date.now();

  return client.zrangebyscore(keyName, 0, now);
};

export const deleteScheduled = async (roomCode: string, keyName: ScheduledNameEnum, multi?: ChainableCommander): Promise<void> => {
  if (multi) {
    multi.zrem(keyName, roomCode);
  } else {
    await client.zrem(keyName, roomCode);
  }
};
