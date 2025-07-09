import { client } from '../../config/db';
import { ChainableCommander } from 'ioredis';
import { MinigamesEnum } from '../../types/roomRepositoryTypes';

const getKey = (roomCode: string) => `game:${roomCode}:gamePlan`;

export const setGamePlan = async (roomCode: string, minigames: MinigamesEnum[], multi?: ChainableCommander) => {
  if (multi) {
    multi.set(getKey(roomCode), JSON.stringify(minigames));
  } else {
    await client.set(getKey(roomCode), JSON.stringify(minigames));
  }
};

export const getGamePlan = async (roomCode: string): Promise<MinigamesEnum[] | null> => {
  const data = await client.get(getKey(roomCode));
  return data ? JSON.parse(data) : null;
};

export const deleteGamePlan = async (roomCode: string, multi?: ChainableCommander) => {
  if (multi) {
    multi.del(getKey(roomCode));
  } else {
    await client.del(getKey(roomCode));
  }
};
