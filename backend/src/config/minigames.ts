import { MinigameDataType, MinigameNamesEnum, RoomDataType, RoomStatusEnum } from '@shared/types';

export const createRoomConfig = (playersLength: number, roomStatus: RoomStatusEnum): RoomDataType => ({
  roomCode: '',
  maxRounds: (playersLength - 1).toString(),
  currentRound: '1',
  currentTurn: Math.floor(Math.random() * playersLength).toString(), // Randomly select the first player to start
  status: roomStatus,
});

export const createClickTheBombConfig = (): MinigameDataType => ({
  minigameName: MinigameNamesEnum.clickTheBomb,
  clickCount: '0',
  maxClicks: '10',
});

export const createCardsConfig = (): MinigameDataType => ({ minigameName: MinigameNamesEnum.cards });

export const createColorsMemoryConfig = (): MinigameDataType => ({ minigameName: MinigameNamesEnum.colorsMemory, sequence: [] });
