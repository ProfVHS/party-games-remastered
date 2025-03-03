// STATUS.TS
export enum EPossibleStates {
  waiting = 'waiting',
  playing = 'playing',
  finished = 'finished',
}

export enum EPossibleMinigames {
  none = 'none',
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
