import { MinigameDataType, MinigameNamesEnum } from '../../types';
import { ClickTheBomb } from './clickthebomb/ClickTheBomb';

type MinigameProps = {
  minigameData: MinigameDataType;
};

export const Minigame = ({ minigameData }: MinigameProps) => {
  return <div>{minigameData.minigameName == MinigameNamesEnum.clickTheBomb && <ClickTheBomb />}</div>;
};
