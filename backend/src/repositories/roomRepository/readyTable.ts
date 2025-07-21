import { ChainableCommander } from 'ioredis';
import { client } from '../../config/db';
import { getKey } from './roomRepository';

const key = 'ready';

export const toggleReady = async (roomCode: string, id: string, multi?: ChainableCommander) => {
  const isReady = await client.sismember(getKey(roomCode, key), id);

  const command = isReady ? 'srem' : 'sadd';

  if (!multi) {
    await client[command](getKey(roomCode, key), id);
    return;
  } else {
    multi[command](getKey(roomCode, key), id);
    return;
  }
};

export const getReadyPlayersCount = async (roomCode: string): Promise<number> => {
  const count = await client.scard(getKey(roomCode, key));
  return count;
};

export const getReadyPlayers = async (roomCode: string): Promise<string[]> => {
  const players = await client.smembers(getKey(roomCode, key));
  return players;
};

export const deleteReadyTable = async (roomCode: string, multi?: ChainableCommander): Promise<void> => {
  if (!multi) {
    await client.del(getKey(roomCode, key));
  } else {
    multi.del(getKey(roomCode, key));
  }
};

export const deletePlayerFromReadyTable = async (roomCode: string, id: string, multi?: ChainableCommander): Promise<void> => {
  if (!multi) {
    await client.srem(getKey(roomCode, key), id);
  } else {
    multi.srem(getKey(roomCode, key), id);
  }
};
