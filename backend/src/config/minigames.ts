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

const roundsLimit: number = 30;
const generateSequence = (): number[] => {
  let array: number[] = [];

  for (let i = 0; i <= roundsLimit; i++) {
    array.push(Math.floor(Math.random() * 9));
  }

  return array;
};

const memoryButtonsConfig: GameRoomDataType = {
  maxRounds: roundsLimit,
  currentRound: 1,
  timeForTurn: 5,
  minigame: MinigamesEnum.memoryButtons,
  currentMinigameData: {
    colourSequence: generateSequence(),
  },
};

export const minigamesConfigs = {
  clickTheBomb: clickTheBombConfig,
  memoryButtons: memoryButtonsConfig,
};
