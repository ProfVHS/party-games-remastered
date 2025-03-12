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

export type MinigameDataType = {
  minigame: EPossibleMinigames;
  state: EPossibleStates;
  rounds: number;
  currentRound: number;
  timeForTurn: number;
  currentMinigameData: TCurrentMinigameData;
};

export type MinigameEntryType = {
  name: string;
};

export type MinigameListItemType = MinigameEntryType & {
  id?: string;
}
