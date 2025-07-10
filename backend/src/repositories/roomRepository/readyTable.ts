import { ChainableCommander } from 'ioredis';
import { client } from '../../config/db';

const getKey = (roomCode: string) => `room:${roomCode}:ready`;

export const toggleReady = async (roomCode: string, id: string, multi?: ChainableCommander) => {
  const isReady = await client.sismember(getKey(roomCode), id);

  const command = isReady ? 'srem' : 'sadd';

  if (!multi) {
    await client[command](getKey(roomCode), id);
    return;
  } else {
    multi[command](getKey(roomCode), id);
    return;
  }
};

export const getReadyPlayersCount = async (roomCode: string): Promise<number> => {
  const count = await client.scard(getKey(roomCode));
  return count;
};

export const getReadyPlayers = async (roomCode: string): Promise<string[]> => {
  const players = await client.smembers(getKey(roomCode));
  return players;
};

export const deleteReadyTable = async (roomCode: string, multi?: ChainableCommander): Promise<void> => {
  if (!multi) {
    await client.del(getKey(roomCode));
  } else {
    multi.del(getKey(roomCode));
  }
};

export const deletePlayerFromReadyTable = async (roomCode: string, id: string, multi?: ChainableCommander): Promise<void> => {
  if (!multi) {
    await client.srem(getKey(roomCode), id);
  } else {
    multi.srem(getKey(roomCode), id);
  }
};
