import {MinigameNamesEnum} from "../types";

export const defaultRoomSettings = {
  isRandomMinigames: true,
  isTutorialsEnabled: true,
  minigames: [],
  numberOfMinigames: 2
};

export const MIN_SCREEN_WIDTH = 1000;

export const TUTORIAL_PAGES_BY_GAME: Record<MinigameNamesEnum, number> = {
    [MinigameNamesEnum.CLICK_THE_BOMB]: 3,
    [MinigameNamesEnum.CARDS]: 3,
    [MinigameNamesEnum.TRICKY_DIAMONDS]: 2,
};