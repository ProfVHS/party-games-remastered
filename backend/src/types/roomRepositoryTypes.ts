// UWAGA: Pola typu "string", które reprezentują liczby (// number),
// są przechowywane jako string celowo — Redis hash (HSET) zapisuje wszystkie wartości jako stringi
// Dzięki temu można bez problemu używać komend typu HINCRBY, HGET, itp., bez dodatkowej konwersji

// roomDataTable.ts
export type RoomDataType = {
  roomCode: string;
  maxRounds: string; // number
  currentRound: string; // number
  currentTurn: string; // number
};

export type MinigameDataType = ClickTheBombDataType | ColorsMemoryDataType;

type ClickTheBombDataType = {
  minigameName: MinigameNamesEnum.clickTheBomb;
  state: MinigameStatesEnum;
  clickCount: string; // number
  maxClicks: string; // number
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

// playersTable.ts
export type PlayerType = {
  id: string;
  nickname: string;
  isAlive: boolean;
  score: number;
  isHost: boolean;
};
