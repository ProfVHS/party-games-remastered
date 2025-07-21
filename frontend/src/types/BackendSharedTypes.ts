export type RoomDataType = {
  roomCode: string;
  maxRounds: number;
  currentRound: number;
  currentTurn: number;
};

export type MinigameDataType = ClickTheBombDataType | ColorsMemoryDataType;

type ClickTheBombDataType = {
  minigameName: MinigameNamesEnum.clickTheBomb;
  state: MinigameStatesEnum;
  clickCount: number;
  maxClicks: number;
};

type ColorsMemoryDataType = {
  minigameName: MinigameNamesEnum.colorsMemory;
  state: MinigameStatesEnum;
  sequence: string[];
};

export enum MinigameNamesEnum {
  clickTheBomb = 'Click the Bomb',
  colorsMemory = 'Colors Memory',
}

export enum MinigameStatesEnum {
  running = 'running',
  finished = 'finished',
}

export type PlayerType = {
  id: string;
  nickname: string;
  isAlive: boolean;
  score: number;
  isHost: boolean;
};
