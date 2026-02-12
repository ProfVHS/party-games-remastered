import { ClickTheBomb } from '@minigames/ClickTheBomb';
import { Cards } from '@minigames/Cards';
import { MinigameNamesEnum } from '@shared/types';

export const MINIGAME_REGISTRY = {
  [MinigameNamesEnum.clickTheBomb]: ClickTheBomb,
  [MinigameNamesEnum.cards]: Cards,
};