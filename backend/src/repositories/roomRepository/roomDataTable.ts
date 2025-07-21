import { client } from '../../config/db';
import { ChainableCommander } from 'ioredis';
import { RoomDataType } from '../../types/roomRepositoryTypes';
import { getKey } from './roomRepository';

const keyName = 'roomData';

export async function setRoomData(roomCode: string, roomData: RoomDataType, multi?: ChainableCommander): Promise<void> {
  roomData = {
    ...roomData,
    roomCode,
  };

  if (multi) {
    multi.set(getKey(roomCode, keyName), JSON.stringify(roomData));
  } else {
    await client.set(getKey(roomCode, keyName), JSON.stringify(roomData));
  }
}

export async function getRoomData(roomCode: string): Promise<RoomDataType | null> {
  const data = await client.get(getKey(roomCode, keyName));

  if (!data) return null;

  return JSON.parse(data);
}
