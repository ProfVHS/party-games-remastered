// MINIGAME.TS

export enum EPossibleStates {
  playing = 'playing',
  finished = 'finished',
}

export enum EPossibleMinigames {
  none = 'none',
  clickTheBomb = 'Click the Bomb',
}

type TClickTheBombData = {
  maxClicks: number;
};

export type TCurrentMinigameData = TClickTheBombData;

export type TMinigameData = {
  minigame: EPossibleMinigames;
  state: EPossibleStates;
  rounds: number;
  currentRound: number;
  timeForTurn: number;
  currentMinigameData: TCurrentMinigameData;
};

// LEADERBOARD.TS
export type TLeaderboardData = {
  points: number;
};

// PLAYERS.TS
export type TPlayer = {
  id: string;
  data: TPlayerData;
};

export type TPlayerData = {
  nickname: string;
  points?: number;
  isAlive?: boolean;
};
