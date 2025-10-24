import { ChainableCommander } from 'ioredis';
import { client } from '@config/db';
import { getKey } from '@roomRepository';
import { ReadyNameEnum } from '@backend-types';

export const toggleReady = async (roomCode: string, id: string, keyName: ReadyNameEnum, multi?: ChainableCommander): Promise<void> => {
  const isReady = await client.sismember(getKey(roomCode, keyName), id);
  const command = isReady ? 'srem' : 'sadd';

  if (multi) {
    multi[command](getKey(roomCode, keyName), id);
  } else {
    await client[command](getKey(roomCode, keyName), id);
  }
};

export const getReadyPlayersCount = async (roomCode: string, keyName: ReadyNameEnum): Promise<number> => {
  return client.scard(getKey(roomCode, keyName));
};

export const getReadyPlayers = async (roomCode: string, keyName: ReadyNameEnum): Promise<string[]> => {
  return client.smembers(getKey(roomCode, keyName));
};

export const deleteReadyTable = async (roomCode: string, keyName: ReadyNameEnum, multi?: ChainableCommander): Promise<void> => {
  if (multi) {
    multi.del(getKey(roomCode, keyName));
  } else {
    await client.del(getKey(roomCode, keyName));
  }
};

export const deletePlayerFromReadyTable = async (roomCode: string, id: string, keyName: ReadyNameEnum, multi?: ChainableCommander): Promise<void> => {
  if (multi) {
    multi.srem(getKey(roomCode, keyName), id);
  } else {
    await client.srem(getKey(roomCode, keyName), id);
  }
};
