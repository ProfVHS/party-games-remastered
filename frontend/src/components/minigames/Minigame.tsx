import { MinigameDataType } from '../../types';

type MinigameProps = {
  minigameData: MinigameDataType;
};

export const Minigame = ({ minigameData }: MinigameProps) => {
  return <div>{minigameData.minigame}</div>;
};
