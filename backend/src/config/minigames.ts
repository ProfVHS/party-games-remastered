import { GameRoomDataType, MinigamesEnum } from '../types/roomRepositoryTypes';

export const clickTheBombConfig: GameRoomDataType = {
  maxRounds: 5,
  currentRound: 1,
  currentTurn: 0, // TODO: Change it to random player
  timeForTurn: 15,
  minigame: MinigamesEnum.clickTheBomb,
  currentMinigameData: {
    maxClicks: 10,
  },
};
