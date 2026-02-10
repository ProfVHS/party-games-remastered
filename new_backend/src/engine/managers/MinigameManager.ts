import { MINIGAME_REGISTRY, minigameIdType } from '@minigames/index';

export const getMinigame = (id: minigameIdType) => {
  return MINIGAME_REGISTRY[id];
};
