// MINIGAME.TS

export enum EPossibleStates {
  playing = 'playing',
  finished = 'finished',
}

export enum EPossibleMinigames {
  none = 'none',
  clickTheBomb = 'Click the Bomb',
}

interface IClickTheBombData {
  maxClicks: number;
}

export type ICustomData = IClickTheBombData;

export interface IMinigameData {
  minigame: EPossibleMinigames;
  state: EPossibleStates;
  rounds: number;
  currentRound: number;
  timeForTurn: number;
  customData: ICustomData;
}

export interface IStatusData {
  minigame?: string;
  state?: EPossibleStates;
}

// LEADERBOARD.TS
export interface ILeaderboardData {
  points: number;
}

// PLAYERS.TS
export interface IPlayer {
  nickname: string;
  data: IPlayerData;
}

export interface IPlayerData {
  points?: number;
  isAlive?: boolean;
}
