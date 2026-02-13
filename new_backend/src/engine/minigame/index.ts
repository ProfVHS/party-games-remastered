import { MinigameNamesEnum } from '@shared/types';
import { ClickTheBomb } from '@minigames/ClickTheBomb';
import { Cards } from '@minigames/Cards';
import { TrickyDiamonds } from '@minigames/TrickyDiamonds';

export const MINIGAME_REGISTRY = {
  [MinigameNamesEnum.clickTheBomb]: ClickTheBomb,
  [MinigameNamesEnum.cards]: Cards,
  [MinigameNamesEnum.trickyDiamonds]: TrickyDiamonds,
};
