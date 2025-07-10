import { client } from '../../config/db';
import { ChainableCommander } from 'ioredis';
import { PlayerType } from '../../types/roomRepositoryTypes';

export const createPlayer = async (roomCode: string, id: string, playerData: PlayerType, multi?: ChainableCommander) => {
  const playersKey = `room:${roomCode}:players`;
  const playerOrderKey = `room:${roomCode}:playersOrder`;

  if (!multi) {
    await client.hset(playersKey, id, JSON.stringify(playerData));
    await client.rpush(playerOrderKey, id);
  } else {
    multi.hset(playersKey, id, JSON.stringify(playerData));
    multi.rpush(playerOrderKey, id);
  }
};

export const updatePlayer = async (roomCode: string, id: string, updates: Partial<PlayerType>, multi?: ChainableCommander): Promise<boolean> => {
  const playersKey = `room:${roomCode}:players`;

  const existingData = await client.hget(playersKey, id);
  if (!existingData) return false;

  const currentData: PlayerType = JSON.parse(existingData);
  const updatedData = { ...currentData, ...updates };

  if (!multi) {
    await client.hset(playersKey, id, JSON.stringify(updatedData));
  } else {
    multi.hset(playersKey, id, JSON.stringify(updatedData));
  }

  return true;
};

export const updateAllPlayers = async (roomCode: string, updates: Partial<PlayerType>, multi?: ChainableCommander): Promise<void> => {
  const playersKey = `room:${roomCode}:players`;

  const players = await client.hgetall(playersKey);

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
  const playersKey = `room:${roomCode}:players`;
  const playerOrderKey = `room:${roomCode}:playersOrder`;

  if (!multi) {
    await client.hdel(playersKey, id);
    await client.lrem(playerOrderKey, 0, id);
  } else {
    multi.hdel(playersKey, id);
    multi.lrem(playerOrderKey, 0, id);
  }
};

export const deleteAllPlayers = async (roomCode: string, multi?: ChainableCommander): Promise<void> => {
  const playersKey = `room:${roomCode}:players`;
  const playerOrderKey = `room:${roomCode}:playersOrder`;

  if (!multi) {
    await client.del(playersKey);
    await client.del(playerOrderKey);
  } else {
    multi.del(playersKey);
    multi.del(playerOrderKey);
  }
};

export const getPlayer = async (roomCode: string, id: string): Promise<PlayerType | null> => {
  const playersKey = `room:${roomCode}:players`;

  const player = await client.hget(playersKey, id);

  if (!player) {
    return null;
  } else {
    return JSON.parse(player);
  }
};

export const getAllPlayers = async (roomCode: string): Promise<PlayerType[] | null> => {
  const playersKey = `room:${roomCode}:players`;
  const playerOrderKey = `room:${roomCode}:playersOrder`;
  const playerIds = await client.lrange(playerOrderKey, 0, -1);

  const rawData = await client.hmget(playersKey, ...playerIds);

  const players = rawData.map((player) => {
    if (!player) return null;
    return JSON.parse(player);
  })

  if (!players) {
    return null;
  } else {
    return players;
  } 
 
};
