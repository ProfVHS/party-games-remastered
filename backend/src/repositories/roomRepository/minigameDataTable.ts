import { ChainableCommander } from 'ioredis';
import { client } from '@config/db';
import { MinigameDataType } from '@shared/types';
import { getKey } from '@roomRepository';

const keyName = 'minigameData';

export async function setMinigameData(roomCode: string, minigameData: Partial<MinigameDataType>, multi?: ChainableCommander): Promise<void> {
  if (multi) {
    multi.hset(getKey(roomCode, keyName), minigameData);
  } else {
    await client.hset(getKey(roomCode, keyName), minigameData);
  }
}

export async function getMinigameData(roomCode: string): Promise<MinigameDataType | null> {
  const minigameData = await client.hgetall(getKey(roomCode, keyName));

  if (!minigameData || Object.keys(minigameData).length === 0) return null;

  return minigameData as MinigameDataType;
}
