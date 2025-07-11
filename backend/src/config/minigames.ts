import { GameRoomDataType, MinigamesEnum } from '../types/roomRepositoryTypes';

export const createClickTheBombConfig = (playersLength: number): GameRoomDataType => ({
  maxRounds: playersLength - 1,
  currentRound: 1,
  currentTurn: Math.floor(Math.random() * playersLength),
  minigame: MinigamesEnum.clickTheBomb,
  currentMinigameData: {
    maxClicks: Math.floor(Math.random() * playersLength * 4) + 1,
    clickCount: 0,
  },
});
