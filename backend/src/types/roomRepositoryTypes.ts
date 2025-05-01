// GAMEROOM.TS
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
}

export type CurrentMinigameDataType = ClickTheBombDataType;

type ClickTheBombDataType = {
  maxClicks: number;
};

// PLAYERS.TS
export type PlayerType = {
  nickname: string;
  isAlive: boolean;
  score: number;
};
