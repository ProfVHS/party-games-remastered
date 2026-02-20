export enum MinigameNamesEnum {
  CLICK_THE_BOMB = "CLICK_THE_BOMB",
  CARDS = "CARDS",
  TRICKY_DIAMONDS = "TRICKY_DIAMONDS",
}

export type DiamondType = {
    id: number;
    players: string[];
    won: boolean;
};