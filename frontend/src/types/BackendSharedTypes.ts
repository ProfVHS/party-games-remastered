export enum RoomStatusEnum {
  lobby = 'lobby',
  game = 'game',
}

export enum MinigameNamesEnum {
  clickTheBomb = 'Click the Bomb',
  colorsMemory = 'Colors Memory',
}

export enum PlayerStatusEnum {
  onilne = 'online',
  offline = 'offline',
}

export type RoomDataType = {
  roomCode: string;
  maxRounds: number;
  currentRound: number;
  currentTurn: number;
  status: RoomStatusEnum;
};

export type MinigameDataType = ClickTheBombDataType | ColorsMemoryDataType;

type ClickTheBombDataType = {
  minigameName: MinigameNamesEnum.clickTheBomb;
  clickCount: number;
  maxClicks: number;
};

type ColorsMemoryDataType = {
  minigameName: MinigameNamesEnum.colorsMemory;
  sequence: string[];
};

export type PlayerType = {
  id: string;
  nickname: string;
  isAlive: boolean;
  score: number;
  isHost: boolean;
  status: PlayerStatusEnum;
};

export type ReturnDataType = {
  success: boolean;
  payload?: any;
};
