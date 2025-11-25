import { client } from '@config/db';
import { ChainableCommander } from 'ioredis';
import { getKey } from '@roomRepository';
import { LockName } from '@backend-types';

// These locks are used to ensure that certain room operations
// (e.g., ending a round, running schedulers)
// are executed only once at a time

export const acquireLock = async (roomCode: string, lockName: LockName): Promise<boolean> => {
  const response = await client.set(getKey(roomCode, lockName), '1', 'NX');
  return response === 'OK';
};

export const deleteLock = async (roomCode: string, lockName: LockName, multi?: ChainableCommander): Promise<void> => {
  if (multi) {
    multi.del(getKey(roomCode, lockName));
  } else {
    await client.del(getKey(roomCode, lockName));
  }
};
