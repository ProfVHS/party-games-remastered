import { MinigameDataType, PossibleMinigamesEnum, PossibleStatesEnum } from '../types/roomRepositoryTypes';

export const clickTheBombConfig: MinigameDataType = {
  minigame: PossibleMinigamesEnum.clickTheBomb,
  state: PossibleStatesEnum.playing,
  rounds: 5,
  currentRound: 1,
  timeForTurn: 15,
  currentMinigameData: {
    maxClicks: 10,
  },
};
