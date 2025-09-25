export enum MinigameNamesEnum {
  clickTheBomb = "Click the Bomb",
  colorsMemory = "Colors Memory",
  cards = "Cards",
}

export type MinigameDataType = ClickTheBombDataType | ColorsMemoryDataType | CardsDataType;

type ClickTheBombDataType = {
  minigameName: MinigameNamesEnum.clickTheBomb;
  clickCount: string; // number
  maxClicks: string; // number
};

type ColorsMemoryDataType = {
  minigameName: MinigameNamesEnum.colorsMemory;
  sequence: string[];
};

type CardsDataType = { minigameName: MinigameNamesEnum.cards };
