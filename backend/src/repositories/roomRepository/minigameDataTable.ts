import { client } from '../../config/db';
import { ChainableCommander } from 'ioredis';
import { MinigameDataType } from '../../types/roomRepositoryTypes';

const getKey = (roomCode: string) => `room:${roomCode}:minigameData`;

export async function setMinigameData(roomCode: string, minigameData: MinigameDataType, multi?: ChainableCommander): Promise<void> {
  if (multi) {
    multi.set(getKey(roomCode), JSON.stringify(minigameData));
  } else {
    await client.set(getKey(roomCode), JSON.stringify(minigameData));
  }
}

export async function getMinigameData(roomCode: string): Promise<MinigameDataType | null> {
  const data = await client.get(getKey(roomCode));

  if (!data) return null;

  return JSON.parse(data);
}
