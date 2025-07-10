import { client } from '../../config/db';
import { ChainableCommander } from 'ioredis';
import { PlayerType } from '../../types/roomRepositoryTypes';

// players or playersOrder
const getKey = (roomCode: string, keyName: string) => `room:${roomCode}:${keyName}`;

export const createPlayer = async (roomCode: string, id: string, playerData: PlayerType, multi?: ChainableCommander) => {
  if (!multi) {
    await client.hset(getKey(roomCode, 'players'), id, JSON.stringify(playerData));
    await client.rpush(getKey(roomCode, 'playersOrder'), id);
  } else {
    multi.hset(getKey(roomCode, 'players'), id, JSON.stringify(playerData));
    multi.rpush(getKey(roomCode, 'playersOrders'), id);
  }
};

export const updatePlayer = async (roomCode: string, id: string, updates: Partial<PlayerType>, multi?: ChainableCommander): Promise<boolean> => {
  const existingData = await client.hget(getKey(roomCode, 'players'), id);
  if (!existingData) return false;

  const currentData: PlayerType = JSON.parse(existingData);
  const updatedData = { ...currentData, ...updates };

  if (!multi) {
    await client.hset(getKey(roomCode, 'players'), id, JSON.stringify(updatedData));
  } else {
    multi.hset(getKey(roomCode, 'players'), id, JSON.stringify(updatedData));
  }

  return true;
};

export const updateAllPlayers = async (roomCode: string, updates: Partial<PlayerType>, multi?: ChainableCommander): Promise<void> => {
  const players = await client.hgetall(getKey(roomCode, 'players'));

  if (!players) return;

  const playerIds = Object.keys(players);

  if (!multi) {
    for (const id of playerIds) {
      await updatePlayer(roomCode, id, updates);
    }
  } else {
    for (const id of playerIds) {
      updatePlayer(roomCode, id, updates, multi);
    }
  }
};

export const deletePlayer = async (roomCode: string, id: string, multi?: ChainableCommander): Promise<void> => {
  if (!multi) {
    await client.hdel(getKey(roomCode, 'players'), id);
    await client.lrem(getKey(roomCode, 'playersOrder'), 0, id);
  } else {
    multi.hdel(getKey(roomCode, 'players'), id);
    multi.lrem(getKey(roomCode, 'playersOrder'), 0, id);
  }
};

export const deleteAllPlayers = async (roomCode: string, multi?: ChainableCommander): Promise<void> => {
  if (!multi) {
    await client.del(getKey(roomCode, 'players'));
    await client.del(getKey(roomCode, 'playersOrder'));
  } else {
    multi.del(getKey(roomCode, 'players'));
    multi.del(getKey(roomCode, 'playersOrder'));
  }
};

export const getPlayer = async (roomCode: string, id: string): Promise<PlayerType | null> => {
  const player = await client.hget(getKey(roomCode, 'players'), id);

  if (!player) {
    return null;
  } else {
    return JSON.parse(player);
  }
};

export const getAllPlayers = async (roomCode: string): Promise<PlayerType[] | null> => {
  const playerIds = await client.lrange(getKey(roomCode, 'playersOrder'), 0, -1);

  const rawData = await client.hmget(getKey(roomCode, 'players'), ...playerIds);

  const players = rawData.map((player) => {
    if (!player) return null;
    return JSON.parse(player);
  });

  return players ? players : null;
};
