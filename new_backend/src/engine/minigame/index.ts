import { ClickTheBomb } from './ClickTheBomb';

export const MINIGAME_REGISTRY = {
  CLICK_THE_BOMB: ClickTheBomb,
};

export type minigameIdType = keyof typeof MINIGAME_REGISTRY;
