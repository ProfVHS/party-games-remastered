import { MINIGAME_REGISTRY, minigameIdType } from '../minigame';

export const getMinigame = (id: minigameIdType) => {
  return MINIGAME_REGISTRY[id];
};
