import { client } from '../../config/db';
import { ChainableCommander } from 'ioredis';
import { GameRoomDataType } from '../../types/roomRepositoryTypes';

export async function setGameRoom(roomCode: string, minigameData: GameRoomDataType, multi?: ChainableCommander): Promise<void> {
  const gameRoomKey = `room:${roomCode}:gameRoom`;

  if (multi) {
    multi.set(gameRoomKey, JSON.stringify(minigameData));
  } else {
    await client.set(gameRoomKey, JSON.stringify(minigameData));
  }
}

export async function getGameRoom(roomCode: string): Promise<GameRoomDataType | null> {
  const gameRoomKey = `room:${roomCode}:gameRoom`;
  const data = await client.get(gameRoomKey);

  if (!data) return null;

  return JSON.parse(data);
}
