export type GameRoomDataType = {
  maxRounds: number;
  currentRound: number;
  timeForTurn: number;
  minigame: MinigamesEnum;
  currentMinigameData: CurrentMinigameDataType;
};

export enum MinigamesEnum {
  none = 'none',
  clickTheBomb = 'Click the Bomb',
  memoryButtons = 'Memory Buttons',
}

export type CurrentMinigameDataType = ClickTheBombDataType | MemoryButtonsDataType;
//'type' field is required because dumbfuck typescript can't handle unions ^
type ClickTheBombDataType = {
  type: 'clickTheBomb';
  maxClicks: number;
};

type MemoryButtonsDataType = {
  type: 'memoryButtons';
  colourSequence: number[];
};

export type PlayerType = {
  nickname: string;
  isAlive: boolean;
  score: number;
};

//FRONTEND ONLY
export type MinigamesListItemType = {
  id?: string;
  name: MinigamesEnum;
};
