import { ClickTheBomb } from './ClickTheBomb';
import { Cards } from './Cards';

export const MINIGAME_REGISTRY = {
  CLICK_THE_BOMB: ClickTheBomb,
  CARDS: Cards,
};

export type minigameIdType = keyof typeof MINIGAME_REGISTRY;
