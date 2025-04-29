import { client } from '../../config/db';
import { ChainableCommander } from 'ioredis';
import { PlayerType } from '../../types/roomRepositoryTypes';

export const createPlayer = async (roomCode: string, id: string, playerData: PlayerType, multi?: ChainableCommander) => {
  const playersKey = `room:${roomCode}:players`;

  if (!multi) {
    await client.hset(playersKey, id, JSON.stringify(playerData));
  } else {
    multi.hset(playersKey, id, JSON.stringify(playerData));
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

  if (!multi) {
    await client.hdel(playersKey, id);
  } else {
    multi.hdel(playersKey, id);
  }
};

export const deleteAllPlayers = async (roomCode: string, multi?: ChainableCommander): Promise<void> => {
  const playersKey = `room:${roomCode}:players`;

  if (!multi) {
    await client.del(playersKey);
  } else {
    multi.del(playersKey);
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

  const players = await client.hgetall(playersKey);

  if (!players) {
    return null;
  } else {
    return Object.values(players).map((player) => JSON.parse(player));
  }
};
