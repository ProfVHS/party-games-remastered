export * from './roomDataTable';
export * from './playersTable';
export * from './minigameDataTable';
export * from './readyTable';
export * from './minigameStarted';
export * from './roomSettingsTable'

export const getKey = (roomCode: string, key: string, subKey?: string): string => {
  return subKey ? `room:${roomCode}:${key}:${subKey}` : `room:${roomCode}:${key}`;
};
