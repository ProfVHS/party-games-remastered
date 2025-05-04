import { GameRoomDataType, MinigamesEnum } from '../types/roomRepositoryTypes';

const clickTheBombConfig: GameRoomDataType = {
  maxRounds: 5,
  currentRound: 1,
  timeForTurn: 15,
  minigame: MinigamesEnum.clickTheBomb,
  currentMinigameData: {
    maxClicks: 10,
  },
};

const memoryButtonsConfig: GameRoomDataType = {
  maxRounds: 99,
  currentRound: 1,
  timeForTurn: 5,
  minigame: MinigamesEnum.memoryButtons,
  currentMinigameData: {
    colourSequence: [Math.floor(Math.random() * 9)],
  },
};

export const minigamesConfigs = {
  clickTheBomb: clickTheBombConfig,
  memoryButtons: memoryButtonsConfig,
};
