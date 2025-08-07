// UWAGA: Pola typu "string", które reprezentują liczby (// number),
// są przechowywane jako string celowo — Redis hash (HSET) zapisuje wszystkie wartości jako stringi
// Dzięki temu można bez problemu używać komend typu HINCRBY, HGET, itp., bez dodatkowej konwersji

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

// roomDataTable.ts
export type RoomDataType = {
  roomCode: string;
  maxRounds: string; // number
  currentRound: string; // number
  currentTurn: string; // number
  status: RoomStatusEnum;
};

export type MinigameDataType = ClickTheBombDataType | ColorsMemoryDataType | CardsDataType;

type ClickTheBombDataType = {
  minigameName: MinigameNamesEnum.clickTheBomb;
  clickCount: string; // number
  maxClicks: string; // number
};

type ColorsMemoryDataType = {
  minigameName: MinigameNamesEnum.colorsMemory;
  sequence: string[];
};

type CardsDataType = { minigameName: MinigameNamesEnum.cards };

// playersTable.ts
export type PlayerType = {
  id: string;
  nickname: string;
  isAlive: string; // boolean
  score: string; // number
  isHost: string; // boolean
  status: PlayerStatusEnum;
};
