import { MinigameDataType, PossibleMinigamesEnum } from '../../types';
import { ClickTheBomb } from './clickthebomb/ClickTheBomb';

type MinigameProps = {
  minigameData: MinigameDataType;
};

export const Minigame = ({ minigameData }: MinigameProps) => {
  return (
    <div>
      {(minigameData.minigame == PossibleMinigamesEnum.clickTheBomb) && <ClickTheBomb />}
    </div>
  )
};
