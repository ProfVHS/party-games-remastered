// MINIGAME.TS

export enum PossibleStatesEnum {
  playing = 'playing',
  finished = 'finished',
}

export enum PossibleMinigamesEnum {
  none = 'none',
  clickTheBomb = 'Click the Bomb',
}

type ClickTheBombDataType = {
  maxClicks: number;
};

export type CurrentMinigameDataType = ClickTheBombDataType;

export type MinigameDataType = {
  minigame: PossibleMinigamesEnum;
  state: PossibleStatesEnum;
  rounds: number;
  currentRound: number;
  timeForTurn: number;
  currentMinigameData: CurrentMinigameDataType;
};

// LEADERBOARD.TS
export type LeaderboardDataType = {
  score: number;
};

// PLAYERS.TS
export type PlayerType = {
  id: string;
  data: PlayerDataType;
};

export type PlayerDataType = {
  nickname: string;
  score?: number;
  isAlive?: boolean;
};
