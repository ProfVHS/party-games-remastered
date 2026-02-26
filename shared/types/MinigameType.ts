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

export type CardPlayersMapType = Record<number, {id: string, nickname: string}[]>;

export const CARDS_GAME_STATUS = {
    CHOOSE: 'Choose a card',
    REVEAL: 'Cards Reveal',
};

export type CardsGameStatus = (typeof CARDS_GAME_STATUS)[keyof typeof CARDS_GAME_STATUS];

export const TRICKY_DIAMONDS_GAME_STATUS = {
    CHOOSE: 'Choose Wisely',
    REVEAL: 'Judgment Time',
};

export type TrickyDiamondsGameStatus = (typeof TRICKY_DIAMONDS_GAME_STATUS)[keyof typeof TRICKY_DIAMONDS_GAME_STATUS];