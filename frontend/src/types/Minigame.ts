export type Minigame = {
  minigame_id: string;
  name: string;
};

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
