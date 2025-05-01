import { ChainableCommander } from 'ioredis';
import { client } from '../../config/db';

export const toggleReady = async (roomCode: string, id: string, multi?: ChainableCommander) => {
  const readyKey = `room:${roomCode}:ready`;

  const isReady = await client.sismember(readyKey, id);

  const command = isReady ? 'srem' : 'sadd';

  if (!multi) {
    await client[command](readyKey, id);
    return;
  } else {
    multi[command](readyKey, id);
    return;
  }
};

export const getReadyPlayersCount = async (roomCode: string): Promise<number> => {
  const readyKey = `room:${roomCode}:ready`;
  const count = await client.scard(readyKey);
  return count;
};

export const getReadyPlayers = async (roomCode: string): Promise<string[]> => {
  const readyKey = `room:${roomCode}:ready`;
  const players = await client.smembers(readyKey);
  return players;
};

export const deleteReadyTable = async (roomCode: string, multi?: ChainableCommander): Promise<void> => {
  const readyKey = `room:${roomCode}:ready`;

  if (!multi) {
    await client.del(readyKey);
  } else {
    multi.del(readyKey);
  }
};

export const deletePlayerFromReadyTable = async (roomCode: string, id: string, multi?: ChainableCommander): Promise<void> => {
  const readyKey = `room:${roomCode}:ready`;

  if (!multi) {
    await client.srem(readyKey, id);
  } else {
    multi.srem(readyKey, id);
  }
};
