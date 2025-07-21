export * from './readyTable';
export * from './playersTable';
export * from './roomDataTable';
export * from './gamePlanTable';
export * from './minigameDataTable';

export const getKey = (roomCode: string, key: string, subKey?: string): string => {
  return subKey ? `room:${roomCode}:${key}:${subKey}` : `room:${roomCode}:${key}`;
};
