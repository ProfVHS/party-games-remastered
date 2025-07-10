import { client } from '../../config/db';
import { ChainableCommander } from 'ioredis';
import { CurrentMinigameDataType, GameRoomDataType } from '../../types/roomRepositoryTypes';

const getKey = (roomCode: string) => `room:${roomCode}:gameRoom`;

export async function setGameRoom(roomCode: string, minigameData: GameRoomDataType, multi?: ChainableCommander): Promise<void> {
  if (multi) {
    multi.set(getKey(roomCode), JSON.stringify(minigameData));
  } else {
    await client.set(getKey(roomCode), JSON.stringify(minigameData));
  }
}

export async function getGameRoom(roomCode: string): Promise<GameRoomDataType | null> {
  const data = await client.get(getKey(roomCode));

  if (!data) return null;

  return JSON.parse(data);
}

export async function updateMinigameData(roomCode: string, minigameData: CurrentMinigameDataType) {
  const existingData = await client.get(getKey(roomCode));

  if (!existingData) {
    throw new Error(`Game room with code "${roomCode}" not found`);
  }

  const parsedData: GameRoomDataType = JSON.parse(existingData);
  parsedData.currentMinigameData = minigameData;

  await client.set(getKey(roomCode), JSON.stringify(parsedData));
}
