import { client } from '@config/db';
import { ChainableCommander } from 'ioredis';
import { getKey } from '@roomRepository';
import { LockName } from '@backend-types';

export const acquireLock = async (roomCode: string, lockName: LockName, ttlSec: number): Promise<boolean> => {
  const response = await client.set(getKey(roomCode, lockName), '1', 'EX', ttlSec, 'NX');
  return response === 'OK';
};

export const deleteLock = async (roomCode: string, lockName: LockName, multi?: ChainableCommander): Promise<void> => {
  if (multi) {
    multi.del(getKey(roomCode, lockName));
  } else {
    await client.del(getKey(roomCode, lockName));
  }
};
