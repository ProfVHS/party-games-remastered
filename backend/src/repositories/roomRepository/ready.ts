import { ChainableCommander } from 'ioredis';
import { client } from '../../config/db';

export const toggleReady = async (roomCode: string, id: string, multi?: ChainableCommander) => {
  const readyKey = `room:${roomCode}:ready`;

  const isReady = await client.sismember(readyKey, id);

  if (multi) {
    if (isReady) {
      multi.srem(readyKey, id);
    } else {
      multi.sadd(readyKey, id);
    }
    return;
  }

  if (isReady) {
    await client.srem(readyKey, id);
  } else {
    await client.sadd(readyKey, id);
  }
};

export const getReadyPlayersCount = async (roomCode: string): Promise<number> => {
  const readyKey = `room:${roomCode}:ready`;
  const count = await client.scard(readyKey);
  return count;
};

export const deleteReady = async (roomCode: string, multi?: ChainableCommander): Promise<void> => {
  const readyKey = `room:${roomCode}:ready`;

  if (!multi) {
    await client.del(readyKey);
  } else {
    multi.del(readyKey);
  }
};

export const deletePlayerFromReady = async (roomCode: string, id: string, multi?: ChainableCommander): Promise<void> => {
  const readyKey = `room:${roomCode}:ready`;

  if (!multi) {
    await client.srem(readyKey, id);
  } else {
    multi.srem(readyKey, id);
  }
};
