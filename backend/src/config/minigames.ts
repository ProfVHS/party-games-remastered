import { MinigameDataType, MinigameNamesEnum, MinigameStatesEnum, RoomDataType } from '../types/roomRepositoryTypes';

export const createRoomConfig = (playersLength: number): RoomDataType => ({
  roomCode: '',
  maxRounds: (playersLength - 1).toString(),
  currentRound: '1',
  currentTurn: Math.floor(Math.random() * playersLength).toString(), // Randomly select the first player to start
});

export const createClickTheBombConfig = (): MinigameDataType => ({
  minigameName: MinigameNamesEnum.clickTheBomb,
  state: MinigameStatesEnum.running,
  clickCount: '0',
  maxClicks: '10',
});
