export enum EPossibleStates {
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
  state: EPossibleStates;
  rounds: number;
  currentRound: number;
  timeForTurn: number;
  currentMinigameData: CurrentMinigameDataType;
};

export type MinigameEntryType = {
  name: string;
};

export type MinigameListItemType = MinigameEntryType & {
  id?: string;
};
