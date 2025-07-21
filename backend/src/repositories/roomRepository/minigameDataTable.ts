import { client } from '../../config/db';
import { ChainableCommander } from 'ioredis';
import { MinigameDataType } from '../../types/roomRepositoryTypes';
import { getKey } from './roomRepository';

const keyName = 'minigameData';

export async function setMinigameData(roomCode: string, minigameData: MinigameDataType, multi?: ChainableCommander): Promise<void> {
  if (multi) {
    multi.set(getKey(roomCode, keyName), JSON.stringify(minigameData));
  } else {
    await client.set(getKey(roomCode, keyName), JSON.stringify(minigameData));
  }
}

export async function getMinigameData(roomCode: string): Promise<MinigameDataType | null> {
  const data = await client.get(getKey(roomCode, keyName));

  if (!data) return null;

  return JSON.parse(data);
}
