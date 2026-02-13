import { MINIGAME_REGISTRY } from '@minigames/index';
import { MinigameNamesEnum } from '@shared/types';

export const getMinigame = (name: MinigameNamesEnum) => {
  return MINIGAME_REGISTRY[name];
};
