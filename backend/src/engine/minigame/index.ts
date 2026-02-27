import { MinigameNamesEnum } from '@shared/types';
import { ClickTheBomb } from '@minigames/ClickTheBomb';
import { Cards } from '@minigames/Cards';
import { TrickyDiamonds } from '@minigames/TrickyDiamonds';

export const MINIGAME_REGISTRY = {
  [MinigameNamesEnum.CLICK_THE_BOMB]: ClickTheBomb,
  [MinigameNamesEnum.CARDS]: Cards,
  [MinigameNamesEnum.TRICKY_DIAMONDS]: TrickyDiamonds,
};
