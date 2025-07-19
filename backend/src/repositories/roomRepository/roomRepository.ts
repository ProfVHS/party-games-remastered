export * from './readyTable';
export * from './playersTable';
export * from './gameRoomTable';
export * from './minigamesTable';

export const getKey = (roomCode: string, key: string, subKey?: string): string => {
  return subKey ? `room:${roomCode}:${key}:${subKey}` : `room:${roomCode}:${key}`;
};
