import { MinigameDataType, MinigameNamesEnum, RoomDataType, RoomStatusEnum } from '../types/roomRepositoryTypes';

export const createRoomConfig = (playersLength: number): RoomDataType => ({
  roomCode: '',
  maxRounds: (playersLength - 1).toString(),
  currentRound: '1',
  currentTurn: Math.floor(Math.random() * playersLength).toString(), // Randomly select the first player to start
  status: RoomStatusEnum.lobby,
});

export const createClickTheBombConfig = (): MinigameDataType => ({
  minigameName: MinigameNamesEnum.clickTheBomb,
  clickCount: '0',
  maxClicks: '10',
});
