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
    multi.hset(getKey(roomCode, keyName), roomData);
  } else {
    await client.hset(getKey(roomCode, keyName), roomData);
  }
}

export async function getRoomData(roomCode: string): Promise<RoomDataType | null> {
  const roomData = await client.hgetall(getKey(roomCode, keyName));

  if (!roomData || Object.keys(roomData).length === 0) return null;

  return roomData as RoomDataType;
}
