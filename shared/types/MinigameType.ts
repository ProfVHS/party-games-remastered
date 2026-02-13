export enum MinigameNamesEnum {
  clickTheBomb = "Click the Bomb",
  cards = "Cards",
  trickyDiamonds = "Tricky Diamonds",
}

export type MinigameDataType = ClickTheBombDataType | ColorsMemoryDataType | CardsDataType | TrickyDiamondsDataType;

export type ClickTheBombDataType = {
  minigameName: MinigameNamesEnum.clickTheBomb;
  clickCount: number;
  maxClicks: number;
  streak: number;
  prizePool: number;
};

export type ColorsMemoryDataType = {
  minigameName: MinigameNamesEnum.cards;
  sequence: string[];
};

export type CardsDataType = { minigameName: MinigameNamesEnum.cards };

export type TrickyDiamondsDataType = { minigameName: MinigameNamesEnum.cards };


export type DiamondType = {
    id: number;
    players: string[];
    won: boolean;
};