import { TMinigameData, EPossibleMinigames, EPossibleStates } from '../types/roomRepositoryTypes';

export const clickTheBombConfig: TMinigameData = {
  minigame: EPossibleMinigames.clickTheBomb,
  state: EPossibleStates.playing,
  rounds: 5,
  currentRound: 1,
  timeForTurn: 15,
  currentMinigameData: {
    maxClicks: 10,
  },
};
