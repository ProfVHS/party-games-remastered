import { MinigameDataType, MinigameNamesEnum, RoomDataType, RoomStatusEnum } from '@shared/types';
import { defaultLobbySettings } from '@shared/constants/defaults';

export const createRoomConfig = (playersLength: number, roomStatus: RoomStatusEnum): Omit<RoomDataType, 'roomCode' | 'minigameIndex'> => ({
  maxRounds: playersLength.toString(),
  currentRound: '1',
  currentTurn: Math.floor(Math.random() * playersLength).toString(), // Randomly select the first player to start
  status: roomStatus,
  lobbySettings: JSON.stringify(defaultLobbySettings)
});

export const createClickTheBombConfig = (alivePlayersLength: number): MinigameDataType => ({
  minigameName: MinigameNamesEnum.clickTheBomb,
  clickCount: '0',
  maxClicks: (Math.floor(Math.random() * (alivePlayersLength * 4)) + 1).toString(),
  streak: '0',
});

export const createCardsConfig = (): MinigameDataType => ({ minigameName: MinigameNamesEnum.cards });

export const createColorsMemoryConfig = (): MinigameDataType => ({ minigameName: MinigameNamesEnum.colorsMemory, sequence: [] });
