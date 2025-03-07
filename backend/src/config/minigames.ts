import { IMinigameData, EPossibleMinigames, EPossibleStates } from '../interfaces/roomRepositoryInterfaces';

export const clickTheBombConfig: IMinigameData = {
  minigame: EPossibleMinigames.clickTheBomb,
  state: EPossibleStates.playing,
  rounds: 5,
  currentRound: 1,
  timeForTurn: 15,
  customData: {
    maxClicks: 10,
  },
};
