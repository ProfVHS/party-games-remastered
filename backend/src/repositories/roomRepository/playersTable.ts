import { client } from '@config/db';
import { ChainableCommander } from 'ioredis';
import { PlayerType } from '@shared/types';
import { getKey } from './roomRepository';

const keyName = 'players';

export const createPlayer = async (roomCode: string, id: string, playerData: PlayerType, multi?: ChainableCommander): Promise<void> => {
  if (multi) {
    multi.hset(getKey(roomCode, keyName, id), playerData);
    multi.rpush(getKey(roomCode, keyName), id);
  } else {
    await client.hset(getKey(roomCode, keyName, id), playerData);
    await client.rpush(getKey(roomCode, keyName), id);
  }
};

export const updatePlayer = async (roomCode: string, id: string, updates: Partial<PlayerType>, multi?: ChainableCommander): Promise<void> => {
  if (multi) {
    multi.hset(getKey(roomCode, keyName, id), updates);
  } else {
    await client.hset(getKey(roomCode, keyName, id), updates);
  }
};

export const updateAllPlayers = async (roomCode: string, updates: Partial<PlayerType>, multi?: ChainableCommander): Promise<void> => {
  const playerIds = await client.lrange(getKey(roomCode, keyName), 0, -1);
  const playerKeys = playerIds.map((id) => getKey(roomCode, keyName, id));

  if (multi) {
    playerKeys.forEach((key) => multi.hset(key, updates));
  } else {
    for (const key of playerKeys) {
      await client.hset(key, updates);
    }
  }
};

export const updatePlayerScore = async (roomCode: string, id: string, score: number, multi?: ChainableCommander): Promise<void> => {
  if (multi) {
    multi.hincrby(getKey(roomCode, keyName, id), 'score', score);
  } else {
    await client.hincrby(getKey(roomCode, keyName, id), 'score', score);
  }
};

export const deletePlayer = async (roomCode: string, id: string, multi?: ChainableCommander): Promise<void> => {
  if (multi) {
    multi.del(getKey(roomCode, keyName, id));
    multi.lrem(getKey(roomCode, keyName), 0, id);
  } else {
    await client.del(getKey(roomCode, keyName, id));
    await client.lrem(getKey(roomCode, keyName), 0, id);
  }
};

export const deleteAllPlayers = async (roomCode: string, multi?: ChainableCommander): Promise<void> => {
  const playerIds = await client.lrange(getKey(roomCode, keyName), 0, -1);
  const playerKeys = playerIds.map((id) => getKey(roomCode, keyName, id));

  if (multi) {
    multi.del(getKey(roomCode, keyName));
    if (playerKeys.length > 0) multi.del(...playerKeys);
  } else {
    await client.del(getKey(roomCode, keyName));
    if (playerKeys.length > 0) await client.del(...playerKeys);
  }
};

export const getPlayer = async (roomCode: string, id: string): Promise<PlayerType | null> => {
  const player = await client.hgetall(getKey(roomCode, keyName, id));

  if (!player || Object.keys(player).length === 0) return null;

  return player as PlayerType;
};

export const getAllPlayers = async (roomCode: string): Promise<PlayerType[]> => {
  const playerIds = await client.lrange(getKey(roomCode, keyName), 0, -1);

  if (playerIds.length === 0) return [];

  const players = await Promise.all(playerIds.map((id) => client.hgetall(getKey(roomCode, keyName, id))));

  return players as PlayerType[];
};

export const getAllPlayerIds = async (roomCode: string): Promise<string[]> => {
  const playerIds = await client.lrange(getKey(roomCode, keyName), 0, -1);

  return playerIds;
};
