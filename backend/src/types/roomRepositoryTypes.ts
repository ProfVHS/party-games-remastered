// GAMEROOM.TS
export type GameRoomDataType = {
  maxRounds: number;
  currentRound: number;
  currentTurn: number;
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
  clickCount: number;
};

// PLAYERS.TS
export type PlayerType = {
  id: string;
  nickname: string;
  isAlive: boolean;
  score: number;
  isHost: boolean;
};
