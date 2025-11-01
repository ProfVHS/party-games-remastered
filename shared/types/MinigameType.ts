export enum MinigameNamesEnum {
  clickTheBomb = "Click the Bomb",
  colorsMemory = "Colors Memory",
  cards = "Cards",
}

export type MinigameDataType = ClickTheBombDataType | ColorsMemoryDataType | CardsDataType;

export type ClickTheBombDataType = {
  minigameName: MinigameNamesEnum.clickTheBomb;
  clickCount: number;
  maxClicks: number;
  streak: number;
  prizePool: number;
};

export type ColorsMemoryDataType = {
  minigameName: MinigameNamesEnum.colorsMemory;
  sequence: string[];
};

export type CardsDataType = { minigameName: MinigameNamesEnum.cards };
