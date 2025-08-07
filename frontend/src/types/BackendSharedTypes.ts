export enum RoomStatusEnum {
  lobby = 'lobby',
  game = 'game',
}

export enum MinigameNamesEnum {
  clickTheBomb = 'Click the Bomb',
  colorsMemory = 'Colors Memory',
  cards = 'Cards',
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

export type MinigameDataType = ClickTheBombDataType | ColorsMemoryDataType | CardsDataType;

type ClickTheBombDataType = {
  minigameName: MinigameNamesEnum.clickTheBomb;
  clickCount: number;
  maxClicks: number;
};

type ColorsMemoryDataType = {
  minigameName: MinigameNamesEnum.colorsMemory;
  sequence: string[];
};

type CardsDataType = { minigameName: MinigameNamesEnum.cards };

export type ReturnDataType = {
  success: boolean;
  payload?: any;
};
