export enum MinigameNamesEnum {
  clickTheBomb = "Click the Bomb",
  colorsMemory = "Colors Memory",
  cards = "Cards",
  buddies = 'Buddies'
}

export type MinigameDataType = ClickTheBombDataType | ColorsMemoryDataType | CardsDataType | BuddiesDataType;

export type ClickTheBombDataType = {
  minigameName: MinigameNamesEnum.clickTheBomb;
  clickCount: number;
  maxClicks: number;
  streak: number;
};

export type ColorsMemoryDataType = {
  minigameName: MinigameNamesEnum.colorsMemory;
  sequence: string[];
};

export type CardsDataType = { minigameName: MinigameNamesEnum.cards };

export type BuddiesDataType = {
  minigameName: MinigameNamesEnum.buddies;
  stage: BuddiesStageType
}

export type BuddiesStageType = 'creating_questions' | 'waiting_for_players' | 'waiting_for_answers' | 'answer' | 'select_best_answer' | 'show_best_answer'
