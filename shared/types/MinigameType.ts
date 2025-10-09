export enum MinigameNamesEnum {
  clickTheBomb = "Click the Bomb",
  colorsMemory = "Colors Memory",
  cards = "Cards",
}

export type MinigameDataType = ClickTheBombDataType | ColorsMemoryDataType | CardsDataType;

export type ClickTheBombDataType = {
  minigameName: MinigameNamesEnum.clickTheBomb;
  clickCount: string; // number
  maxClicks: string; // number
  streak: string; // number
};

export type ColorsMemoryDataType = {
  minigameName: MinigameNamesEnum.colorsMemory;
  sequence: string[];
};

export type CardsDataType = { minigameName: MinigameNamesEnum.cards };
