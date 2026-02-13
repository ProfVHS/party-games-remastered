import {MinigameNamesEnum} from "../types";

export const defaultRoomSettings = {
  isRandomMinigames: true,
  isTutorialsEnabled: true,
  minigames: [],
  numberOfMinigames: 2
};

export const MIN_SCREEN_WIDTH = 1000;

export const MAX_PAGES_BY_GAME: Record<MinigameNamesEnum, number> = {
    [MinigameNamesEnum.clickTheBomb]: 3,
    [MinigameNamesEnum.cards]: 3,
    [MinigameNamesEnum.trickyDiamonds]: 2,
};